import dotenv from "dotenv";
import express from "express";
import { jwtDecode } from "jwt-decode";
import { Invoice, Phone, XeroClient } from "xero-node";
import session from "express-session";
dotenv.config();

const client_id = process.env.XERO_CLIENT_ID;
const client_secret = process.env.XERO_CLIENT_SECRET;
const redirectUrl = process.env.XERO_REDIRECT_URI;
const scopes =
  "openid profile email accounting.settings accounting.reports.read accounting.journals.read accounting.contacts accounting.attachments accounting.transactions offline_access";

// Create a new XeroClient
const xero = new XeroClient({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUris: [redirectUrl],
  scopes: scopes.split(" "),
  grantType: "authorization_code",
});

if (!client_id || !client_secret || !redirectUrl) {
  throw Error(
    "Environment Variables not all set - please check your .env file in the project root or create one!"
  );
}

const app = express();

// Set up the session
app.use(
  session({
    secret: "DEVSECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const authenticationData = (req, res) => {
  return {
    decodedIdToken: req.session.decodedIdToken,
    decodedAccessToken: req.session.decodedAccessToken,
    tokenSet: req.session.tokenSet,
    allTenants: req.session.allTenants,
    activeTenant: req.session.activeTenant,
  };
};

// Routes
app.get("/", (req, res) => {
  res.send(`<a href='/connect'>Connect to Xero</a>`);
});

app.get("/connect", async (req, res) => {
  try {
    const consentUrl = await xero.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (err) {
    res.send("Sorry, something went wrong");
  }
});

app.get("/callback", async (req, res) => {
  try {
    const tokenSet = await xero.apiCallback(req.url);
    await xero.updateTenants();
    const decodedIdToken = jwtDecode(tokenSet.id_token);
    const decodedAccessToken = jwtDecode(tokenSet.access_token);

    req.session.decodedIdToken = decodedIdToken;
    req.session.decodedAccessToken = decodedAccessToken;
    req.session.tokenSet = tokenSet;
    req.session.allTenants = xero.tenants;

    // XeroClient is sorting tenants behind the scenes so that most recent / active connection is at index 0
    req.session.activeTenant = xero.tenants[0];

    const authData = authenticationData(req, res);

    res.redirect("/organisation");
  } catch (err) {
    console.log(err);
    res.send("Sorry, something went wrong");
  }
});

app.get("/organisation", async (req, res) => {
  try {
    const tokenSet = await xero.readTokenSet();
    console.log(tokenSet.expired() ? "expired" : "valid");
    const response = await xero.accountingApi.getOrganisations(req.session.activeTenant.tenantId);
    res.send(`Hello, ${response.body.organisations[0].name}`);
  } catch (err) {
    console.log(err);
    res.send("Sorry, something went wrong");
  }
});

app.post("/invoices", async (req, res) => {
  try {
    const contacts = await xero.accountingApi.getContacts(req.session.activeTenant.tenantId);
    const where = 'Status=="ACTIVE" AND Type=="SALES"';
    const accounts = await xero.accountingApi.getAccounts(
      req.session.activeTenant.tenantId,
      null,
      where
    );
    const contact = {
      contactID: contacts.body.contacts[0].contactID,
    };
    const lineItem = {
      accountID: accounts.body.accounts[0].accountID,
      description: "consulting",
      quantity: 1.0,
      unitAmount: 10.0,
    };
    const invoice = {
      lineItems: [lineItem],
      contact: contact,
      dueDate: "2021-09-25",
      date: "2021-09-24",
      type: Invoice.TypeEnum.ACCREC,
    };
    const invoices = {
      invoices: [invoice],
    };
    const response = await xero.accountingApi.createInvoices(
      req.session.activeTenant.tenantId,
      invoices
    );
    res.json(response.body.invoices);
  } catch (err) {
    res.json(err);
  }
});

app.post("/contacts", async (req, res) => {
  try {
    const contact = {
      name: "Bruce Banner",
      emailAddress: "hulk@avengers.com",
      phones: [
        {
          phoneNumber: "555-555-5555",
          phoneType: Phone.PhoneTypeEnum.MOBILE,
        },
      ],
    };
    const contacts = {
      contacts: [contact],
    };
    const response = await xero.accountingApi.createContacts(
      req.session.activeTenant.tenantId,
      contacts
    );
    res.json(response.body.contacts);
  } catch (err) {
    res.json(err);
  }
});

app.get("/contacts", async (req, res) => {
  try {
    const response = await xero.accountingApi.getContacts(req.session.activeTenant.tenantId);
    res.json(response.body.contacts);
  } catch (err) {
    res.json(err);
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const response = await xero.accountingApi.getInvoices(req.session.activeTenant.tenantId);
    res.json(response.body.invoices);
  } catch (err) {
    res.json(err);
  }
});

app.get("/bank-transactions", async (req, res) => {
  try {
    const response = await xero.accountingApi.getBankTransactions(
      req.session.activeTenant.tenantId
    );
    res.json(response.body.bankTransactions);
  } catch (err) {
    res.json(err);
  }
});

app.get("/payment-history", async (req, res) => {
  try {
    const response = await xero.accountingApi.getPaymentHistory(req.session.activeTenant.tenantId);
    res.json(response.body.paymentHistory);
  } catch (err) {
    res.json(err);
  }
});

app.get("/reports", async (req, res) => {
    try {
        const response = await xero.accountingApi.getReportsList(req.session.activeTenant.tenantId);
        res.json(response.body.reports);
    } catch (err) {
        res.json(err);
    }
});

app.get("/reports/TenNinetyNine", async (req, res) => {
    try {
        const response = await xero.accountingApi.getReportTenNinetyNine(req.session.activeTenant.tenantId);
        res.json(response.body.reports);
    } catch (err) {
        res.json(err);
    }
});

app.get("/logout", async (req, res) => {
  if (req.session) {
    delete req.session;
  }
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
