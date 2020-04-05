const {Builder, By, Key, until} = require('selenium-webdriver');
 
(async function test() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Make the chrome big
    await driver.manage().window().maximize();
    // Get the URL 
    await driver.get('localhost:3000');
    // Before testing the Support section, we will create CLIENT user for testing which will create TWO dummy tickets
    await (await driver.findElement(By.linkText('CLIENT CREATE ACCOUNT'))).click();
    // Wait 1s until we're loaded on the correct page
    await driver.wait(until.urlIs('http://localhost:3000/Client_Reg'), 1000);
    // Now, fill in the data
    await driver.findElement(By.name('name')).sendKeys('Ksenia1', Key.RETURN);
    await driver.findElement(By.name('username')).sendKeys('client_Ksenia22', Key.RETURN);
    await driver.findElement(By.name('password')).sendKeys('password_Ksenia1', Key.RETURN);
    await driver.findElement(By.name('retypedPassword')).sendKeys('password_Ksenia1');
    // Now press the register button
    await (await driver.findElement(By.name('register'))).click();
    // We should be able to login now, wait for the page and then try logging in
    // Waiting up to 3 seconds as database might taken longer than a usual of 1045ms.
    await driver.sleep(1000);
    // Fill in the username and password details
    await driver.findElement(By.name('username')).sendKeys('client_Ksenia22', Key.RETURN);
    await driver.findElement(By.name('password')).sendKeys('password_Ksenia1', Key.RETURN);
    // As Ksenia is a client, he's supposed to be at /Dashboard
    await driver.wait(until.urlIs('http://localhost:3000/Dashboard'), 3000);
    // Now, click New Ticket button
    // Selenium itself works way too fast for our application and page can't render that fast
    await driver.sleep(500);
    await (await driver.findElement(By.name('test-newTicket'))).click();
    // Fill in the title then description
    await driver.findElement(By.id('ticketTitle')).sendKeys('Ticket for Jane');
    await driver.findElement(By.id('ticketDesc')).sendKeys('Fantabolous description of my problem including the extraoridnary description of the ticket');
    // Selenium itself works way too fast for our application and page can't render that fast
    await driver.sleep(300);
    // Click the submit button
    await (await driver.findElement(By.id('test-submit'))).click();
    // Selenium itself works way too fast for our application and page can't render that fast
    await driver.sleep(500);
    // Confirmation message should be displayed, click OKAY
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now, repeat the steps. We want to have another ticket created too
    await (await driver.findElement(By.linkText('New Ticket'))).click();
    // Fill in the title then description
    await driver.findElement(By.id('ticketTitle')).sendKeys('Ticket for Hallam');
    await driver.findElement(By.id('ticketDesc')).sendKeys('Fantabolous description of my problem including the extraoridnary description of the ticket');
    // Click the submit button
    await (await driver.findElement(By.id('test-submit'))).click();
    // Selenium itself works way too fast for our application and page can't render that fast
    await driver.sleep(500);
    // Confirmation message should be displayed, click OKAY
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now there are 2 tickets in the system. Time to logout client and create then login as a support member
    await (await driver.findElement(By.name('test-logout'))).click();
    // Click yes but wait half a second before
    await driver.sleep(500);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now we should be at the login site
    await driver.wait(until.urlIs('http://localhost:3000/Login'), 1700);
    await driver.sleep(300);
    // Go back to default one so support test is ready to start
    await (await driver.findElement(By.className('goBack'))).click();

    //
    //  SUPPORT SECTION
    //



    // Get the button name and click it
    await (await driver.findElement(By.linkText('SUPPORT CREATE ACCOUNT'))).click();
    // Wait 1s until we're loaded on the correct page
    await driver.wait(until.urlIs('http://localhost:3000/Support_Reg'), 1000);
    // Now, fill in the data
    await driver.findElement(By.name('name')).sendKeys('Jane', Key.RETURN);
    await driver.findElement(By.name('username')).sendKeys('support_jane', Key.RETURN);
    await driver.findElement(By.name('password')).sendKeys('password_jane', Key.RETURN);
    await driver.findElement(By.name('retypedPassword')).sendKeys('password_jane', Key.RETURN);
    // Last enter sent the data to the server, now we should be at the Login page
    // Waiting up to 1.3 seconds as database might taken longer than a usual of 1045ms.
    await driver.sleep(1300);
    await driver.wait(until.urlIs('http://localhost:3000/login'), 700);
    // Fill in the username and password details
    await driver.findElement(By.name('username')).sendKeys('support_jane', Key.RETURN);
    await driver.findElement(By.name('password')).sendKeys('password_jane', Key.RETURN);
    await driver.sleep(500);
    // As Jane is support team member, she's supposed to be at /Dashboard_Support
    await driver.wait(until.urlIs('http://localhost:3000/Support_Dashboard'), 500);
    await driver.sleep(1500);
    // We're at Staff's Dashboard
    // We expect NOT to have any tickets assigned to us as we're testing, although we can expect to have a couple of available tickets.
    // Tickets were created by user called Ksenia with title of Ticket for Jane AND Ticket for Jane 2
    await (await driver.findElement(By.className('Ticket for Jane'))).click();
    // Now, confirm that we want to take that ticket but wait half a second
    await driver.sleep(500);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Repeat the steps to press OK button
    await driver.sleep(500);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now ticket is in our inventory
    await (await driver.findElement(By.className('t Ticket for Jane'))).click();
    await driver.sleep(300);
    // Now click the CLOSE Ticket button
    await (await driver.findElement(By.id('closeTicket'))).click();
    // Put the reason into the field
    await driver.findElement(By.className('swal2-input')).sendKeys('TEST AUTOMATION COMPLETE STAGE 1/2');
    // Press ok to confirm it
    await driver.sleep(200);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    //
    // Ticket number 2
    //
    await driver.sleep(400);
    await (await driver.findElement(By.className('Ticket for Hallam'))).click();
    // Now, confirm that we want to take that ticket but wait half a second
    await driver.sleep(500);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Repeat the steps to press OK button
    await driver.sleep(500);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now ticket is in our inventory
    await (await driver.findElement(By.className('t Ticket for Hallam'))).click();
    await driver.sleep(300);
    // Now click the CLOSE Ticket button
    await (await driver.findElement(By.id('solveTicket'))).click();
    // Put the reason into the field
    await driver.findElement(By.className('swal2-input')).sendKeys('TEST AUTOMATION COMPLETE STAGE 2/2');
    // Press ok to confirm it
    await driver.sleep(200);
    await (await driver.findElement(By.className('swal2-confirm swal2-styled'))).click();
    // Now Logout
    await driver.sleep(100);
    await (await driver.findElement(By.name('test-logout'))).click();
  } finally {
    // Close it
    await driver.quit();
  }
})();