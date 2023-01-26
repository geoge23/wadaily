import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.EMAIL_KEY;
const emailClient = new EmailClient(connectionString);

export default emailClient;
