window.onload = function () {
    const random = Math.random().toString(36).substring(2);
    // Import the crypto library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';

    // Add the following property to the script element
    script.nonce = random;

    // Append the script element to the document body
    document.body.appendChild(script);
}