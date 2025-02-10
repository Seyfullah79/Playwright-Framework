const { test } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');
const dataset = require('../Utils/UserManagement_td.json');

test.describe('User Tests @regression', () => {
  let poManager;
  const newUser = dataset.new_user;
  const gmxConfig = dataset.gmxIMAP;

  test.beforeAll(async ({ browser }) => {
    poManager = await POManager.initializeAndNavigate(browser);
    await poManager.loginPage.navigateTesterLoginPage();
  });

  test('should navigate user register page', async () => {
    await poManager.userManagementPage.navigateToUserRegisterPage();
  });

  test('should create a new User', async () => {
    await poManager.userManagementPage.createUser(newUser.first_name, newUser.last_name, newUser.email);
    await poManager.userManagementPage.verifyRegistrationSuccess();
    await poManager.userManagementPage.ReturnToLoginPage();
  });

  test('should find and process email', async () => {
    await poManager.userManagementPage.fetchAndProcessEmail(gmxConfig);
  });

  test('should fill password and submit', async () => {
    await poManager.userManagementPage.fillPasswordAndSubmit(newUser.password);
  });

  test('should delete the account', async () => {
    await poManager.userManagementPage.deleteAccount(newUser.password);
  });

});