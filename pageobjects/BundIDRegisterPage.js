const { expect } = require('@playwright/test');
const imaps = require('imap-simple');
const cheerio = require('cheerio');
const quotedPrintable = require('quoted-printable');



class BundIDRegisterPage {
  constructor(page) {
    this.page = page;

    // Use more specific locators if possible for better resilience
    this.registerLink = page.getByRole('link', { name: 'Registrieren Sie sich jetzt' });
    this.firstNameInput = page.getByLabel('Vorname:');
    this.lastNameInput = page.locator("input[name='nachname']");
    this.userEmailInput = page.locator("input[name='email']");
    this.userEmailRepeatInput = page.locator("input[name='emailrepeat']");
    this.signUpButton = page.getByRole('button', { name: 'Registrieren' });
    this.successMessage = page.locator('text=Das hat geklappt');
    this.successMessageText = page.locator('text=Die Registrierung ist fast abgeschlossen.');
    this.backToRegisterPage = page.getByRole('button', { name: 'Zurück zur Anmeldeseite' });

    this.userPasswordInput = page.locator("input[name='aclBenutzer[passwort]']");
    this.userPasswordRepeatInput = page.locator("input[name='aclBenutzer[passwort_repeat]']");
    this.submitPasswordButton = page.getByLabel('Speichern');
    this.userDataSavedText = page.getByText('Ihre Benutzerdaten wurden');
    this.savedPasswordOkButton = page.getByLabel('OK');

    // Variables for deleting the account
    this.deleteAccountButton = page.getByLabel('Account löschen');
    this.currentPasswordInput = page.locator("input[name='aclBenutzer[passwordCurrent]']");
    this.confirmDeleteButton = page.getByLabel('Jetzt löschen');


    // Store GMX config within the class for better organization and potential reuse
    this.gmxConfig = null;
  }

  async navigateToUserRegisterPage() {
    await this.registerLink.click();
  }

  async createUser(firstName, lastName, email) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.userEmailInput.fill(email);
    await this.userEmailRepeatInput.fill(email);
    await this.signUpButton.click();
  }

  async verifyRegistrationSuccess() {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessageText).toBeVisible();
  }

  async ReturnToLoginPage() {
    await this.backToRegisterPage.click();
  }

  async fetchAndProcessEmail(gmxConfig) {
    this.gmxConfig = gmxConfig; // Store config for potential later use.

    const config = {
      imap: {
        ...gmxConfig, // Spread the config for cleaner code.
        user: 'Seyfullah.kilinc@gmx.de',
        password: 'Seyf@123..',
        host: 'imap.gmx.com',
        port: 993,
        tls: true,
        authTimeout: 5000, // Increased timeout for potentially slow connections.
      },
    };


    let connection;
    try {
      connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      const searchCriteria = [
        ['UNSEEN'], // Search for unseen emails only.
        ['HEADER', 'SUBJECT', 'Ihre Anmeldung im Portal'],
        ['HEADER', 'FROM', 'test.foerderung.nrw@no-reply.nrw.de'],
      ];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        markSeen: true, // Mark as seen to avoid processing the same email multiple times.
      };

      let messages = [];
      for (let i = 0; i < 5; i++) { // Retry up to 5 times if no email is found.
        await this.page.reload(); // Refresh the page to ensure the email is received
        messages = await connection.search(searchCriteria, fetchOptions);
        if (messages.length > 0) {
          break; // Exit the loop if messages are found
        }
        console.log(`No matching emails found. Retry ${i + 1}/5...`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 5 seconds before retrying
      }

      if (messages.length === 0) {
        console.log("No matching emails found.");
        return null; // Return null if no email is found.
      }


      const emailData = await this.processEmail(messages[0]); // Process the first email.

      if (!emailData || !emailData.link) {
        console.error("Could not extract link from email");
        return null;
      }

      console.log("Navigating to link:", emailData.link);
      await this.page.goto(emailData.link, { waitUntil: 'networkidle', timeout: 60000 });
      console.log("Navigation complete. Current URL:", this.page.url());
      return emailData; // Return the extracted data.

    } catch (error) {
      console.error("Error processing email:", error);
      return null; // Return null on error.
    } finally {
      if (connection) {
        connection.end();
      }
    }
  }


  async processEmail(item) {
    try {
      const headerPart = item.parts.find(part => part.which === 'HEADER');
      const textPart = item.parts.find(part => part.which === 'TEXT');

      if (!headerPart || !textPart) {
        console.error("Could not find header or text part in email.");
        return null;
      }

      const header = headerPart.body;
      const subject = header.subject ? header.subject[0] : 'No subject';
      const from = header.from ? header.from[0] : 'No sender';
      const rawBody = textPart.body;

      const decodedBody = quotedPrintable.decode(rawBody).toString('utf8');
      const $ = cheerio.load(decodedBody);
      const link = $('a').attr('href'); // Directly get the href of the first link.

      return {
        subject,
        from,
        link,
      };
    } catch (error) {
      console.error("Error in processEmail:", error);
      return null;
    }

  }

  async fillPasswordAndSubmit(password) {
    await this.userPasswordInput.fill(password);
    await this.userPasswordRepeatInput.fill(password);
    await this.submitPasswordButton.click();
    await this.page.waitForTimeout(2000); // Wait for the success message to appear.
    await this.savedPasswordOkButton.click();
  }

  async deleteAccount(currentPassword) {
    await this.deleteAccountButton.click();
    await this.currentPasswordInput.fill(currentPassword);
    await this.confirmDeleteButton.click();
    await this.page.waitForTimeout(2000); // Wait for the success message to appear.
  }


}
module.exports = { BundIDRegisterPage };


