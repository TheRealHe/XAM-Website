async function subirImagen(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "xam_products");

    const respuesta = await fetch(
        "https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    const datos = await respuesta.json();

    return datos.secure_url;

}