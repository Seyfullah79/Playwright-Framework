const { expect } = require('@playwright/test');
const dataset = require('../Utils/FormCreationAndManagement_td.json');

class FormToFillOut {
    constructor(page) {
        this.page = page;

        this.legalApplicant = page.locator("[type='radio'][name*='antragKontaktdaten']");
        this.applicantSalutationDropdown = page.locator("#antragstellerAnrede-trigger-picker");
        this.firstNameInput = page.locator("input[name='antragKontaktdaten[antragstellerVorname]']");
        this.lastNameInput = page.locator("input[name='antragKontaktdaten[antragstellerNachname]']");
        this.streetInput = page.locator("input[name='antragKontaktdaten[antragstellerStrasse]']");
        this.postalCodeInput = page.locator("input[name='antragKontaktdaten[antragstellerPlz]']");
        this.cityInput = page.locator("input[name='antragKontaktdaten[antragstellerOrt]']");
        this.municipalityCodeInput = page.locator("input[name='antragKontaktdaten[antragstellerGemeindekennziffer]']");
        this.accountHolderInput = page.locator("input[name='antragKontaktdaten[antragstellerKontoinhaber]']");
        this.ibanInput = page.locator("input[name='antragKontaktdaten[antragstellerIban]']");
        this.bicInput = page.locator("input[name='antragKontaktdaten[antragstellerBic]']");
        this.bankNameInput = page.locator("input[name='antragKontaktdaten[antragstellerKreditinstitut]']");

        // New locators for "Angaben zur Maßnahme/ zum Vorhaben" section
        this.projectNameInput = page.locator("[name='antragGenerisch[massnahmetitel]']");
        this.projectDescriptionInput = page.locator("[name='zusatzfeld[55610]']");
        this.projectStartDateInput = page.locator("input[name='antragGenerisch[massnahmeDurchfuehrungszeitraumVon]']");
        this.projectEndDateInput = page.locator("input[name='antragGenerisch[massnahmeDurchfuehrungszeitraumBis]']");
        this.projectPostalCodeInput = page.locator("input[name='antragGenerisch[massnahmeDurchfuehrungsortPlz]']");
        this.projectLocationInput = page.locator("input[name='antragGenerisch[massnahmeDurchfuehrungsortOrt]']");
        this.antiTerrorDeclarationCheckbox = page.locator("[name='antragGenerisch[erklaerungNichtFinanzierungTerror]']");
        this.dataProtectionCheckbox = page.locator("input[name='antragGenerisch[datenschutzGelesen]']");
        this.saveProgressButton = page.getByRole('button', { name: 'Zwischenstand speichern' });
        this.applicationSavedMessage = page.locator("text='Der Antrag wurde gespeichert.'");
        this.saveProgressOkButton = page.getByLabel('OK', { exact: true });
        this.submitApplicationButton = page.getByRole('button', { name: 'Antrag online einreichen' });
        this.confirmButton = page.getByRole('button', { name: 'Ja' });
        this.successMessageButton = page.getByRole('button', { name: 'Ja' });
    }

    async fillPersonalDetails() {
        await this.legalApplicant.last().click();
        await this.applicantSalutationDropdown.click();
        await this.page.locator(`text=${dataset.Anrede}`).click();
        await this.firstNameInput.fill(dataset.Vorname);
        await this.lastNameInput.fill(dataset.Nachname);
        await this.streetInput.fill(dataset.StraßeUndNr);
        await this.postalCodeInput.fill(dataset.PLZ);
        await expect(this.cityInput).toHaveValue(dataset.Ort);
        await expect(this.municipalityCodeInput).toHaveValue(dataset.Gemeindekennziffer);
    }

    async fillBankDetails() {
        await this.accountHolderInput.fill(dataset.KontoInhaber);
        await this.ibanInput.fill(dataset.IBAN);
        await this.bicInput.fill(dataset.BIC);
        await this.bankNameInput.fill(dataset.Kreditinstitut);
    }

    async fillProjectDetails() {
        await this.projectNameInput.fill(dataset.projectName);
        await this.projectDescriptionInput.fill(dataset.projectDescription);
        await this.projectPostalCodeInput.fill(dataset.projectPostalCode);
        await expect(this.projectLocationInput).toHaveValue(dataset.projectLocation);
        await this.projectStartDateInput.fill(dataset.projectStartDate);
        await this.projectEndDateInput.fill(dataset.projectEndDate);
        await this.antiTerrorDeclarationCheckbox.click();
        await this.dataProtectionCheckbox.check();
    }

    async fillForm() {
        await this.fillPersonalDetails();
        await this.fillBankDetails();
        await this.fillProjectDetails();
    }

    async saveProgress() {
        await this.saveProgressButton.click();
        await expect(this.applicationSavedMessage).toBeVisible();
        await this.saveProgressOkButton.click();
    }

    async submitForm() {
        await this.submitApplicationButton.click();
        await this.confirmButton.click();
        await this.successMessageButton.click();
    }


   }

module.exports = { FormToFillOut };