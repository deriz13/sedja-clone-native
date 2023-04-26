<?php
$host = "localhost"; // nama host mysql
$username = "root"; // nama pengguna mysql
$password = ""; // password mysql
$database = "sedja_clone"; // nama database yang akan digunakan

// membuat koneksi ke database
$conn = mysqli_connect($host, $username, $password, $database);

// cek koneksi
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

echo "Koneksi berhasil";
?>