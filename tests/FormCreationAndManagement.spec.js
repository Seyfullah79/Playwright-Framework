const { test } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');
const dataset = require('../Utils/FormCreationAndManagement_td.json');

test.describe('Form Tests @smoke', () => {
  let poManager;

  test.beforeAll(async ({ browser }) => {
    poManager = await POManager.initializeAndNavigate(browser);
    await poManager.loginPage.navigateTesterLoginPage();
    await poManager.loginPage.validTesterLogin(dataset.user_email, dataset.password);
  });

  test('should create a new contract', async () => {
    await poManager.loginPage.navigateContract();
  });

  test('should fill out and save the form', async () => {
    await poManager.formToFillOut.fillForm();
    await poManager.formToFillOut.saveProgress();
  });

  test('should verify the saved form in My Applications', async () => {

    await poManager.myApplicationsPage.navigateToMyApplications();
    await poManager.myApplicationsPage.checkSavedForm();
    await poManager.myApplicationsPage.filterFormAndDeleteConract();
  });

});

