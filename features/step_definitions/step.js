// Importing required modules from Cucumber and Playwright
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager');
const dataset = require('../../Utils/FormCreationAndManagement_td.json');
const fs = require('fs');
const path = require('path');

// Define page navigation map for dynamic page handling
const pageNavigationMap = {
    "My Applications": (poManager) => poManager.myApplicationsPage.navigateToMyApplications(),
};

// ✅ Before Hook: Launch the browser before each scenario
Before(async function () {
    if (!this.browser) {
        this.browser = await chromium.launch({ headless: false });
        console.log("🚀 Browser instance created.");
    }
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
    console.log("🌍 New browser context and page initialized.");
});

// ✅ After Hook: Close the browser after each scenario
After(async function () {
    if (this.browser) {
        await this.browser.close();
        console.log("❌ Browser closed after scenario execution.");
    }
});

// ✅ Function to retrieve URL from JSON file
function getUrlFromJson(urlKey) {
    try {
        const filePath = path.resolve(__dirname, '../../Utils/loginPages_td.json');
        console.log(`🔍 Fetching URL from: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 JSON file not found: ${filePath}`);
        }

        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (!jsonData[urlKey]) {
            throw new Error(`❌ URL key "${urlKey}" not found in loginPages_td.json`);
        }

        console.log(`✅ Found URL: ${jsonData[urlKey]}`);
        return jsonData[urlKey];
    } catch (error) {
        console.error(`❌ Error retrieving URL: ${error.message}`);
        throw error;
    }
}

// ✅ Navigate to a specific URL based on the provided key
Given('I navigate to {string}', { timeout: 50000 }, async function (urlKey) {
    const finalUrl = getUrlFromJson(urlKey);
    
    if (!finalUrl) {
        throw new Error(`❌ URL not found in loginPages_td.json under key "${urlKey}"`);
    }

    console.log(`🌍 Navigating to: ${finalUrl}`);
    await this.page.goto(finalUrl);
});

// ✅ Log in as a tester
When('I am logged in as a tester', { timeout: 50000 }, async function () {
    console.log("🔑 Logging in as a tester...");
    await this.poManager.loginPage.navigateTesterLoginPage();
    await this.poManager.loginPage.validTesterLogin(dataset.user_email, dataset.password);
    console.log("✅ Tester login successful.");
});

// ✅ Fill out the form and save it
When('I fill out the form and save it', { timeout: 50000 }, async function () {
    console.log("📝 Filling out the form...");
    await this.poManager.loginPage.createContractButton.click();
    await this.poManager.loginPage.interactWithYearButtons();
    await this.poManager.loginPage.createSelectedContract.first().click();
    await this.poManager.formToFillOut.fillForm();
    await this.poManager.formToFillOut.saveProgress();
    console.log("✅ Form saved successfully.");
});

// ✅ Navigate to a dynamic page
When('I navigate to the {string} page', { timeout: 50000 }, async function (pageName) {
    if (pageNavigationMap[pageName]) {
        console.log(`🌍 Navigating to page: ${pageName}`);
        await pageNavigationMap[pageName](this.poManager);
    } else {
        throw new Error(`❌ Page navigation for "${pageName}" is not implemented.`);
    }
});

// ✅ Verify the saved form appears
Then('I should see the saved form', { timeout: 50000 }, async function () {
    console.log("🔍 Checking for saved form...");
    await this.poManager.myApplicationsPage.checkSavedForm();
    console.log("✅ Saved form is visible.");
});

// ✅ Delete the saved form
Then('I should be able to delete the saved form', { timeout: 50000 }, async function () {
    console.log("🗑️ Deleting saved form...");
    await this.poManager.myApplicationsPage.filterFormAndDeleteConract();
    console.log("✅ Saved form deleted.");
});

// ✅ Start user registration process
When('I start the user registration process', { timeout: 50000 }, async function () {
    console.log("🚀 Navigating to user registration page...");
    await this.poManager.loginPage.navigateTesterLoginPage();
    await this.poManager.userManagementPage.navigateToUserRegisterPage();
});

// ✅ Verify user registration page URL
Then('I should see the registration page', { timeout: 50000 }, async function () {
    console.log("🔍 Checking if registration page is loaded...");
    await expect(this.page).toHaveURL('https://test.xn--frderung-n4a.nrw/onlineantrag#registrierung');
    console.log("✅ Registration page verified.");
});

// ✅ Create user dynamically from JSON
function getTestData(fileName) {
    const filePath = path.resolve(__dirname, `../../Utils/${fileName}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`🚨 JSON file not found: ${filePath}`);
    }

    console.log(`📂 Reading test data from: ${filePath}`);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ✅ Register a new user dynamically
When('I create a new user using {string} with key {string}', async function (dataFile, userKey) {
    try {
        const testData = getTestData(dataFile);
        const user = testData[userKey];

        if (!user) {
            throw new Error(`🚨 User key "${userKey}" not found in ${dataFile}`);
        }

        console.log(`📧 Registering user: ${user.first_name} ${user.last_name} (${user.email})`);
        await this.poManager.userManagementPage.createUser(user.first_name, user.last_name, user.email);
        console.log("✅ User registration completed.");
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
});

// ✅ Verify that user sees a success message after registration
Then('I should see a success message', { timeout: 50000 }, async function () {
    console.log("🔍 Checking for success message...");
    await this.poManager.userManagementPage.verifyRegistrationSuccess();
    console.log("✅ Success message verified.");
});

// ✅ Verify user is redirected to the login page
Then('I should be redirected to the login page', { timeout: 50000 }, async function () {
    console.log("🔄 Redirecting to login page...");
    await this.poManager.userManagementPage.ReturnToLoginPage();
    await expect(this.page).toHaveURL('https://test.xn--frderung-n4a.nrw/onlineantrag#login');
    console.log("✅ Successfully redirected to the login page.");
});

// ✅ Verify email and set a password
When('I verify the email and set the password for {string} using {string}', { timeout: 50000 }, async function (emailKey, fileName) {
    try {
        // Resolve the JSON file path
        const filePath = path.resolve(__dirname, `../../Utils/${fileName}`);
        console.log(`📂 Resolving JSON File Path: ${filePath}`);

        // Check if the JSON file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 File not found: ${filePath}`);
        }

        // Read and parse JSON file
        const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`📜 Extracted JSON Data:`, testData[emailKey] || "❌ Key not found!");

        // Validate that required fields exist in JSON
        if (!testData[emailKey] || !testData[emailKey].user || !testData[emailKey].password) {
            throw new Error(`🚨 Key "${emailKey}" not found in ${filePath} or missing user/password`);
        }

        // Store IMAP credentials
        const gmxConfig = {
            imap: {
                host: 'imap.gmx.com',
                port: 993,
                tls: true,
                authTimeout: 5000,
                user: testData[emailKey].user,
                password: testData[emailKey].password
            }
        };

        // Debugging IMAP User & Password
        console.log(`📩 Attempting to fetch email for user: ${gmxConfig.imap.user}`);
        console.log(`🔑 IMAP Password (masked for security): ${gmxConfig.imap.password.replace(/./g, '*')}`);

        // Verify email using IMAP
        try {
            await this.poManager.userManagementPage.fetchAndProcessEmail(gmxConfig);
            console.log(`📨 Email processing completed for: ${gmxConfig.imap.user}`);
        } catch (imapError) {
            console.error(`❌ IMAP Email Fetching Error: ${imapError.message}`);
            throw new Error(`IMAP email processing failed: ${imapError.message}`);
        }

        // Extract password from JSON
        const password = testData[emailKey].password;
        console.log(`🔑 Using password (masked): ${password.replace(/./g, '*')} to submit form`);

        // Submit password and complete verification
        await this.poManager.userManagementPage.fillPasswordAndSubmit(password);
        console.log("✅ Password submission completed successfully.");

    } catch (error) {
        console.error(`❌ Error in email verification process: ${error.message}`);
        throw error;
    }
});

// ✅ Delete the user account
When('I delete the account linked to {string} in {string}', { timeout: 50000 }, async function (emailKey, fileName) {
    try {
        const testData = getTestData(fileName);
        const emailData = testData[emailKey];

        if (!emailData || !emailData.password) {
            throw new Error(`🚨 Email key "${emailKey}" not found in ${fileName}`);
        }

        console.log(`🗑️ Deleting account for: ${emailData.user}`);
        await this.poManager.userManagementPage.deleteAccount(emailData.password);
        console.log("✅ Account deletion successful.");
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
});
