<?php
if (isset($_FILES['pdfFile'])) {
  $file = $_FILES['pdfFile']['name'];
  $file_tmp = $_FILES['pdfFile']['tmp_name'];
  $target_dir = "../upload/";

  if (move_uploaded_file($file_tmp, $target_dir . $file)) {
    echo "File berhasil diunggah ke direktori";
  } else {
    echo "Terjadi kesalahan saat mengunggah file";
  }
}
?>