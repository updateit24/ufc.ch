<?php
// Configuración del servidor de correo de Gmail
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Asegúrate de tener PHPMailer instalado mediante Composer

// Recoger los datos del formulario
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

// Validar los datos
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    die('Por favor, complete todos los campos requeridos.');
}

// Configuración del correo
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'update.it24@gmail.com'; // Cambia a tu dirección de Gmail
    $mail->Password = 'tu_contraseña'; // Cambia a tu contraseña de Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Destinatario y remitente
    $mail->setFrom('update.it24@gmail.com', 'UpDateIT24');
    $mail->addAddress('update.it24@gmail.com'); // Enviar el correo a ti mismo

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = 'Nuevo mensaje de contacto';
    $mail->Body    = "Nombre: $name<br>Email: $email<br>Teléfono: $phone<br>Mensaje: $message";

    // Enviar correo
    $mail->send();
    echo 'El mensaje se ha enviado correctamente.';
} catch (Exception $e) {
    echo "No se pudo enviar el mensaje. Error: {$mail->ErrorInfo}";
}
?>
