<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $captchaResponse = $_POST['g-recaptcha-response'];
    $secretKey = '6Lc3fGAqAAAAAJyYsCmzUWBGZdypkK6oiOFNtQC1'; // Reemplaza con tu clave secreta de reCAPTCHA

    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$captchaResponse}");
    $responseKeys = json_decode($response, true);

    if (intval($responseKeys["success"]) !== 1) {
        echo json_encode(['success' => false, 'message' => 'Captcha inválido.']);
    } else {
        echo json_encode(['success' => true]);
    }
}
?>
