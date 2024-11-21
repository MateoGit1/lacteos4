import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendPQRSFResponse = async (to, pqrsf) => {
  try {
    await transporter.sendMail({
      from: `"Lácteos Andinos" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Respuesta a tu PQRSF - ${pqrsf.motivo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #166534;">Respuesta a tu PQRSF</h2>
          <p>Hola ${pqrsf.nombre},</p>
          <p>Hemos revisado tu ${pqrsf.motivo.toLowerCase()} y queremos darte una respuesta:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tu mensaje:</strong></p>
            <p style="margin: 10px 0;">${pqrsf.descripcion}</p>
            <p style="margin: 0;"><strong>Nuestra respuesta:</strong></p>
            <p style="margin: 10px 0;">${pqrsf.respuesta}</p>
          </div>
          <p>Estado: <strong>${pqrsf.estado}</strong></p>
          <p>Gracias por ayudarnos a mejorar nuestros servicios.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};