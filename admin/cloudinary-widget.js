(function () {
    const CLOUD_NAME = "k3pbhkqi";
    const UPLOAD_PRESET = "xam_products";

    const UPLOAD_URL =
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // ---------------------------------------------------------
    // Utilidades
    // ---------------------------------------------------------

    function getPublicIdFromUrl(url) {
        if (!url || typeof url !== "string") return "";

        try {
            const parts = url.split("/upload/");

            if (parts.length < 2) return "";

            let path = parts[1];

            // Elimina transformaciones de Cloudinary
            path = path.replace(/^.*?\//, function (match) {
                // Si después de upload hay transformaciones,
                // intentamos conservar el public_id.
                if (
                    match.includes("f_") ||
                    match.includes("q_") ||
                    match.includes("w_") ||
                    match.includes("h_") ||
                    match.includes("c_")
                ) {
                    return "";
                }

                return match;
            });

            // Elimina extensión
            path = path.replace(/\.[^/.]+$/, "");

            return path;
        } catch (error) {
            return "";
        }
    }

    function optimizedUrl(url) {
        if (!url || typeof url !== "string") {
            return url;
        }

        // Si ya contiene transformaciones, no las duplicamos.
        if (url.includes("/f_auto,q_auto/")) {
            return url;
        }

        return url.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto/"
        );
    }

    // ---------------------------------------------------------
    // Subir una imagen a Cloudinary
    // ---------------------------------------------------------

    async function uploadImage(file, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", UPLOAD_URL);

            xhr.upload.addEventListener("progress", function (event) {
                if (event.lengthComputable && onProgress) {
                    const percentage =
                        Math.round((event.loaded / event.total) * 100);

                    onProgress(percentage);
                }
            });

            xhr.addEventListener("load", function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);

                        if (!response.secure_url) {
                            reject(
                                new Error(
                                    "Cloudinary no devolvió una URL válida."
                                )
                            );
                            return;
                        }

                        resolve(optimizedUrl(response.secure_url));
                    } catch (error) {
                        reject(
                            new Error(
                                "La respuesta de Cloudinary no es válida."
                            )
                        );
                    }
                } else {
                    let message = "Error subiendo la imagen.";

                    try {
                        const response = JSON.parse(xhr.responseText);

                        if (response.error && response.error.message) {
                            message = response.error.message;
                        }
                    } catch (error) {
                        // Ignoramos el error de parsing.
                    }

                    reject(new Error(message));
                }
            });

            xhr.addEventListener("error", function () {
                reject(
                    new Error(
                        "No se pudo conectar con Cloudinary."
                    )
                );
            });

            xhr.addEventListener("abort", function () {
                reject(
                    new Error(
                        "La subida fue cancelada."
                    )
                );
            });

            const formData = new FormData();

            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            // Asset folder configurado también desde el preset.
            // No necesitamos ponerlo aquí si ya lo configuraste
            // en Cloudinary.

            xhr.send(formData);
        });
    }

    // ---------------------------------------------------------
    // Estilos del widget
    // ---------------------------------------------------------

    function injectStyles() {
        if (document.getElementById("xam-cloudinary-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "xam-cloudinary-styles";

        style.textContent = `
            .xam-cloudinary {
                width: 100%;
            }

            .xam-cloudinary-dropzone {
                border: 2px dashed #aaa;
                border-radius: 8px;
                padding: 30px 20px;
                text-align: center;
                cursor: pointer;
                background: #fafafa;
                transition: all 0.2s ease;
                margin-bottom: 15px;
            }

            .xam-cloudinary-dropzone:hover {
                border-color: #555;
                background: #f5f5f5;
            }

            .xam-cloudinary-dropzone.dragging {
                border-color: #0085ba;
                background: #eef8ff;
            }

            .xam-cloudinary-dropzone.disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .xam-cloudinary-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .xam-cloudinary-subtitle {
                font-size: 13px;
                color: #777;
            }

            .xam-cloudinary-input {
                display: none;
            }

            .xam-cloudinary-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .xam-cloudinary-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
            }

            .xam-cloudinary-preview {
                width: 65px;
                height: 65px;
                object-fit: cover;
                border-radius: 5px;
                background: #eee;
                flex-shrink: 0;
            }

            .xam-cloudinary-info {
                flex: 1;
                min-width: 0;
            }

            .xam-cloudinary-name {
                font-size: 13px;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .xam-cloudinary-status {
                font-size: 12px;
                color: #777;
                margin-top: 5px;
            }

            .xam-cloudinary-progress {
                height: 5px;
                background: #eee;
                border-radius: 3px;
                overflow: hidden;
                margin-top: 7px;
            }

            .xam-cloudinary-progress-bar {
                height: 100%;
                width: 0%;
                background: #0085ba;
                transition: width 0.15s ease;
            }

            .xam-cloudinary-remove {
                border: none;
                background: transparent;
                color: #d33;
                cursor: pointer;
                font-size: 18px;
                padding: 5px;
                flex-shrink: 0;
            }

            .xam-cloudinary-remove:hover {
                color: #a00;
            }

            .xam-cloudinary-error {
                color: #d33;
            }

            .xam-cloudinary-count {
                font-size: 13px;
                color: #666;
                margin-bottom: 10px;
            }
        `;

        document.head.appendChild(style);
    }

    // ---------------------------------------------------------
    // Widget Control
    // ---------------------------------------------------------

    const CloudinaryControl = createClass({

        getInitialState: function () {
            return {
                uploading: 0,
                dragging: false
            };
        },

        componentDidMount: function () {
            injectStyles();
        },

        handleFiles: async function (files) {
            const validFiles = Array.from(files).filter(function (file) {
                return file.type && file.type.startsWith("image/");
            });

            if (validFiles.length === 0) {
                return;
            }

            const currentValue = Array.isArray(this.props.value)
                ? this.props.value
                : [];

            const newUrls = [];
            const self = this;

            this.setState({
                uploading: validFiles.length
            });

            for (const file of validFiles) {

                const temporaryId =
                    `upload-${Date.now()}-${Math.random()}`;

                // Añadimos una entrada temporal para mostrar
                // el progreso mientras se sube.
                this.setState(function (state) {

                    return {
                        [`${temporaryId}`]: {
                            id: temporaryId,
                            name: file.name,
                            progress: 0,
                            status: "Subiendo..."
                        }
                    };

                });

                try {

                    const url = await uploadImage(
                        file,
                        function (progress) {

                            self.setState(function () {
                                return {
                                    [`${temporaryId}`]: {
                                        id: temporaryId,
                                        name: file.name,
                                        progress: progress,
                                        status: `Subiendo... ${progress}%`
                                    }
                                };
                            });

                        }
                    );

                    newUrls.push(url);

                    self.setState(function () {
                        return {
                            [`${temporaryId}`]: {
                                id: temporaryId,
                                name: file.name,
                                progress: 100,
                                status: "✓ Subida"
                            }
                        };
                    });

                } catch (error) {

                    console.error(
                        "Cloudinary upload error:",
                        error
                    );

                    self.setState(function () {
                        return {
                            [`${temporaryId}`]: {
                                id: temporaryId,
                                name: file.name,
                                progress: 0,
                                status: `Error: ${error.message}`,
                                error: true
                            }
                        };
                    });
                }
            }

            // Guardamos solamente URLs.
            // IMPORTANTE: esto produce:
            //
            // "imagenes": [
            //     "https://...",
            //     "https://..."
            // ]
            //
            // y NO objetos.

            if (newUrls.length > 0) {

                const updatedValue = [
                    ...currentValue,
                    ...newUrls
                ];

                this.props.onChange(updatedValue);
            }

            this.setState({
                uploading: 0
            });
        },

        handleInputChange: function (event) {
            this.handleFiles(event.target.files);

            // Permite volver a seleccionar el mismo archivo.
            event.target.value = "";
        },

        handleDrop: function (event) {
            event.preventDefault();

            this.setState({
                dragging: false
            });

            if (
                event.dataTransfer &&
                event.dataTransfer.files
            ) {
                this.handleFiles(
                    event.dataTransfer.files
                );
            }
        },

        handleDragOver: function (event) {
            event.preventDefault();

            this.setState({
                dragging: true
            });
        },

        handleDragLeave: function (event) {
            event.preventDefault();

            this.setState({
                dragging: false
            });
        },

        removeImage: function (index) {
            const currentValue = Array.isArray(this.props.value)
                ? this.props.value
                : [];

            const updatedValue = currentValue.filter(
                function (_, i) {
                    return i !== index;
                }
            );

            this.props.onChange(updatedValue);
        },

        moveImage: function (fromIndex, toIndex) {
            const currentValue = Array.isArray(this.props.value)
                ? [...this.props.value]
                : [];

            if (
                toIndex < 0 ||
                toIndex >= currentValue.length
            ) {
                return;
            }

            const item = currentValue.splice(fromIndex, 1)[0];

            currentValue.splice(toIndex, 0, item);

            this.props.onChange(currentValue);
        },

        render: function () {

            const value = Array.isArray(this.props.value)
                ? this.props.value
                : [];

            const uploadingItems = Object.keys(this.state)
                .filter(function (key) {
                    return key.startsWith("upload-");
                })
                .map(function (key) {
                    return this.state[key];
                });

            const self = this;

            return h(
                "div",
                {
                    className: "xam-cloudinary"
                },

                h(
                    "input",
                    {
                        id: this.props.forID,
                        className: "xam-cloudinary-input",
                        type: "file",
                        accept: "image/*",
                        multiple: true,
                        onChange: this.handleInputChange
                    }
                ),

                h(
                    "label",
                    {
                        htmlFor: this.props.forID,
                        className:
                            "xam-cloudinary-dropzone" +
                            (this.state.dragging
                                ? " dragging"
                                : "") +
                            (this.state.uploading > 0
                                ? " disabled"
                                : ""),

                        onDragOver: this.handleDragOver,

                        onDragEnter: this.handleDragOver,

                        onDragLeave: this.handleDragLeave,

                        onDrop: this.handleDrop
                    },

                    h(
                        "div",
                        {
                            className:
                                "xam-cloudinary-title"
                        },
                        "📷 Arrastra tus imágenes aquí"
                    ),

                    h(
                        "div",
                        {
                            className:
                                "xam-cloudinary-subtitle"
                        },
                        "o haz click para seleccionar varias"
                    )
                ),

                value.length > 0
                    ? h(
                        "div",
                        {
                            className:
                                "xam-cloudinary-count"
                        },
                        `${value.length} imagen${
                            value.length === 1
                                ? ""
                                : "es"
                        } seleccionada${
                            value.length === 1
                                ? ""
                                : "s"
                        }`
                    )
                    : null,

                h(
                    "div",
                    {
                        className:
                            "xam-cloudinary-list"
                    },

                    value.map(function (url, index) {

                        return h(
                            "div",
                            {
                                className:
                                    "xam-cloudinary-item",
                                key: url + index
                            },

                            h(
                                "img",
                                {
                                    className:
                                        "xam-cloudinary-preview",
                                    src: url,
                                    alt:
                                        `Imagen ${index + 1}`
                                }
                            ),

                            h(
                                "div",
                                {
                                    className:
                                        "xam-cloudinary-info"
                                },

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-name"
                                    },
                                    getPublicIdFromUrl(url) ||
                                        `Imagen ${index + 1}`
                                ),

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-status"
                                    },
                                    "✓ Cloudinary"
                                )
                            ),

                            h(
                                "button",
                                {
                                    type: "button",
                                    className:
                                        "xam-cloudinary-remove",
                                    onClick: function () {
                                        self.removeImage(index);
                                    },
                                    title:
                                        "Eliminar imagen"
                                },
                                "✕"
                            )
                        );
                    }),

                    uploadingItems.map(function (item) {

                        return h(
                            "div",
                            {
                                className:
                                    "xam-cloudinary-item",
                                key: item.id
                            },

                            h(
                                "div",
                                {
                                    className:
                                        "xam-cloudinary-preview",
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }
                                },
                                "⏳"
                            ),

                            h(
                                "div",
                                {
                                    className:
                                        "xam-cloudinary-info"
                                },

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-name"
                                    },
                                    item.name
                                ),

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-status" +
                                            (
                                                item.error
                                                    ? " xam-cloudinary-error"
                                                    : ""
                                            )
                                    },
                                    item.status
                                ),

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-progress"
                                    },

                                    h(
                                        "div",
                                        {
                                            className:
                                                "xam-cloudinary-progress-bar",
                                            style: {
                                                width:
                                                    `${item.progress}%`
                                            }
                                        }
                                    )
                                )
                            )
                        );
                    })
                )
            );
        }
    });

    // ---------------------------------------------------------
    // Widget Preview
    // ---------------------------------------------------------

    const CloudinaryPreview = createClass({

        render: function () {

            const value = Array.isArray(this.props.value)
                ? this.props.value
                : [];

            if (value.length === 0) {
                return h(
                    "div",
                    {},
                    "No hay imágenes."
                );
            }

            return h(
                "div",
                {
                    style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px"
                    }
                },

                value.map(function (url, index) {

                    return h(
                        "img",
                        {
                            key: url + index,
                            src: url,
                            alt:
                                `Imagen ${index + 1}`,
                            style: {
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "6px"
                            }
                        }
                    );

                })
            );
        }
    });

    // ---------------------------------------------------------
    // Registrar widget
    // ---------------------------------------------------------

    function registerWidget() {

        if (
            typeof CMS === "undefined"
        ) {
            console.error(
                "XAM Cloudinary Widget: Decap CMS no está disponible."
            );

            return;
        }

        CMS.registerWidget(
            "cloudinary",
            CloudinaryControl,
            CloudinaryPreview
        );

        console.log(
            "XAM Cloudinary Widget registrado correctamente."
        );
    }

    // Esperamos a que Decap exista.
    if (typeof CMS !== "undefined") {

        registerWidget();

    } else {

        window.addEventListener(
            "load",
            registerWidget
        );

    }

})();