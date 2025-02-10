const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
const { POManager } = require('../../pageobjects/POManager');
const dataset = require('../../Utils/FormCreationAndManagement_td.json');
const datasetUserManagement = require('../../Utils/UserManagement_td.json');
const fs = require('fs');  
const path = require('path');  


// Close the browser after each scenario
After(async function () {
    if (this.browser) {
        await this.browser.close();
    }
});

// steps for Form Creation and management
Given('I launch the browser and navigate to the login page', { timeout: 50000 }, async function () {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    this.poManager = new POManager(this.page);
    await this.poManager.loginPage.navigateURL();
});

When('I am logged in as a tester', { timeout: 50000 }, async function () {
    await this.poManager.loginPage.navigateTesterLoginPage();
    await this.poManager.loginPage.validTesterLogin(dataset.user_email, dataset.password);
});

When('I fill out the form and save progress', { timeout: 50000 }, async function () {
    await this.poManager.loginPage.createContractButton.click();
    await this.poManager.loginPage.interactWithYearButtons();
    await this.poManager.loginPage.createSelectedContract.first().click();
    await this.poManager.formToFillOut.fillForm();
    await this.poManager.formToFillOut.saveProgress();
});

When('I navigate to My Applications page', { timeout: 50000 }, async function () {
    await this.poManager.myApplicationsPage.navigateToMyApplications();

});

Then('I should see the saved form', { timeout: 50000 }, async function () {
    await this.poManager.myApplicationsPage.checkSavedForm();
});

Then('I should delete the saved form', { timeout: 50000 }, async function () {
    await this.poManager.myApplicationsPage.filterFormAndDeleteConract();
});

// steps for User Management
When('I navigate to the user registration page', { timeout: 50000 }, async function () {
    await this.poManager.loginPage.navigateTesterLoginPage();
    await this.poManager.userManagementPage.navigateToUserRegisterPage();
});

Then('I should see the user registration page', { timeout: 50000 }, async function () {
    await expect(this.page).toHaveURL('https://test.xn--frderung-n4a.nrw/onlineantrag#registrierung');
});

When('I create a user with name {string}, lastname {string} and email {string}', { timeout: 50000 }, async function (firstName, lastName, email) {
    await this.poManager.userManagementPage.createUser(firstName, lastName, email); // Use page object
});

When('I create a user with fallowing information {string} , {string} and {string}', async function (firstName, lastName, email) {
    await this.poManager.userManagementPage.createUser(firstName, lastName, email);
});


Then('I should see a success message', { timeout: 50000 }, async function () {
    await this.poManager.userManagementPage.verifyRegistrationSuccess();
});

Then('I should return to the login page', { timeout: 50000 }, async function () {
    await this.poManager.userManagementPage.ReturnToLoginPage();
    await expect(this.page).toHaveURL('https://test.xn--frderung-n4a.nrw/onlineantrag#login');
});

When('I create a user from {string} using key {string}', async function (dataFile, userKey) {
    try {
        // ✅ Adjust path to point to the correct folder (Utils/)
        const filePath = path.resolve(__dirname, '../../Utils', dataFile);
        console.log(`📂 Resolving JSON File Path: ${filePath}`);

        // ✅ Check if file exists before reading
        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 File not found: ${filePath}`);
        }

        // ✅ Read and parse JSON file
        let testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // ✅ Extract user data dynamically
        const user = testData[userKey];

        if (!user) {
            throw new Error(`🚨 Key "${userKey}" not found in ${dataFile}`);
        }

        console.log(`📧 Registering user: ${user.first_name} ${user.last_name} (${user.email})`);

        await this.poManager.userManagementPage.createUser(user.first_name, user.last_name, user.email);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
});

When('I verify the email and set the password for {string} from {string}', { timeout: 50000 }, async function (emailKey, fileName) {
    try {
        const filePath = path.resolve(__dirname, `../../Utils/${fileName}`);
        console.log(`📂 Resolving JSON File Path: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 File not found: ${filePath}`);
        }

        const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!testData[emailKey] || !testData[emailKey].user || !testData[emailKey].password) {
            throw new Error(`🚨 Key "${emailKey}" not found in ${filePath} or missing user/password`);
        }

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

        console.log(`📩 Fetching email for: ${gmxConfig.imap.user}`);

        await this.poManager.userManagementPage.fetchAndProcessEmail(gmxConfig);

        const password = testData[emailKey].password;
        console.log(`🔑 Using password: ${password} to submit form`);

        await this.poManager.userManagementPage.fillPasswordAndSubmit(password);
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
});

When('I delete the account using {string} from file {string}', { timeout: 50000 }, async function (emailKey, fileName) {
    try {
        const filePath = path.resolve(__dirname, `../../Utils/${fileName}`);
        console.log(`📂 Resolving JSON File Path: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`🚨 File not found: ${filePath}`);
        }

        const testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!testData[emailKey] || !testData[emailKey].password) {
            throw new Error(`🚨 Key "${emailKey}" not found in ${filePath} or missing password`);
        }

        const password = testData[emailKey].password;
        console.log(`🗑️ Deleting account using password: ${password}`);

        await this.poManager.userManagementPage.deleteAccount(password);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
});






