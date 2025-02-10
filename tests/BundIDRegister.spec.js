const { test } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');
const dataset = require('../Utils/BundIDRegisterInfo.json');

test.describe('User Tests @regression', () => {
    let poManager;
    const newUser = dataset.new_user;
    const bundIdLogin = dataset.BundIDRegister;
    const gmxConfig = dataset.gmxIMAP;
  
    test.beforeAll(async ({ browser }) => {
      poManager = await POManager.initializeAndNavigate(browser);
      await poManager.loginPage.navigateTesterLoginPage();
    });
    test('should navigate user register page', async () => {
      await poManager.BundIDRegister.navigateToUserRegisterPage();
    });
  
   

  
  });