/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env.js";
import AppError from "../errorHelpers/AppError.js";

const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
});

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    subject,
    templateData,
    templateName,
    to,
    attachments,
}: SendEmailOptions) => {
    try {
        console.log(`Attempting to send email to ${to} with template ${templateName}...`);
        
        // Verify connection configuration
        await transporter.verify();
        console.log("SMTP connection verified successfully.");

        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            })),
        });

        console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error: any) {
        console.error("CRITICAL: Email Sending Failed!");
        console.error("Error Message:", error.message);
        console.error("SMTP Config used:", {
            host: envVars.EMAIL_SENDER.SMTP_HOST,
            port: envVars.EMAIL_SENDER.SMTP_PORT,
            user: envVars.EMAIL_SENDER.SMTP_USER,
            from: envVars.EMAIL_SENDER.SMTP_FROM
        });
        throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to send email: ${error.message}`);
    }
};
