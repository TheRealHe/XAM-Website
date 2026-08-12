(function () {
    const CLOUD_NAME = "k3pbhkqi";
    const UPLOAD_PRESET = "xam_products";

    const UPLOAD_URL =
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    // ---------------------------------------------------------
    // Optimizar URL de Cloudinary
    // ---------------------------------------------------------

    function optimizeCloudinaryUrl(url) {
        if (!url || typeof url !== "string") {
            return url;
        }

        if (url.includes("/f_auto,q_auto/")) {
            return url;
        }

        return url.replace(
            "/image/upload/",
            "/image/upload/f_auto,q_auto/"
        );
    }

    // ---------------------------------------------------------
    // Subir imagen
    // ---------------------------------------------------------

    function uploadImage(file, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", UPLOAD_URL);

            xhr.upload.addEventListener("progress", function (event) {
                if (
                    event.lengthComputable &&
                    typeof onProgress === "function"
                ) {
                    const percentage = Math.round(
                        (event.loaded / event.total) * 100
                    );

                    onProgress(percentage);
                }
            });

            xhr.addEventListener("load", function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);

                        if (!data.secure_url) {
                            reject(
                                new Error(
                                    "Cloudinary no devolvió una URL."
                                )
                            );
                            return;
                        }

                        resolve(
                            optimizeCloudinaryUrl(
                                data.secure_url
                            )
                        );

                    } catch (error) {
                        reject(
                            new Error(
                                "Respuesta inválida de Cloudinary."
                            )
                        );
                    }

                    return;
                }

                let message =
                    "Cloudinary rechazó la subida.";

                try {
                    const data =
                        JSON.parse(xhr.responseText);

                    if (
                        data.error &&
                        data.error.message
                    ) {
                        message =
                            data.error.message;
                    }

                } catch (error) {
                    // No hacemos nada.
                }

                reject(new Error(message));
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
            formData.append(
                "upload_preset",
                UPLOAD_PRESET
            );

            xhr.send(formData);
        });
    }

    // ---------------------------------------------------------
    // CSS
    // ---------------------------------------------------------

    function injectStyles() {
        if (
            document.getElementById(
                "xam-cloudinary-styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "xam-cloudinary-styles";

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
                transition: 0.2s;
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

            .xam-cloudinary-count {
                font-size: 13px;
                color: #666;
                margin-bottom: 10px;
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

            .xam-cloudinary-error {
                color: #d33;
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
                transition: width 0.15s;
            }

            .xam-cloudinary-remove {
                border: none;
                background: transparent;
                color: #d33;
                cursor: pointer;
                font-size: 18px;
                padding: 5px;
            }

            .xam-cloudinary-remove:hover {
                color: #a00;
            }
        `;

        document.head.appendChild(style);
    }

    // ---------------------------------------------------------
    // Control
    // ---------------------------------------------------------

    const CloudinaryControl = createClass({

        getInitialState: function () {
            return {
                dragging: false,
                uploads: []
            };
        },

        componentDidMount: function () {
            injectStyles();
        },

        handleFiles: function (fileList) {

            const files =
                Array.from(fileList).filter(
                    function (file) {
                        return (
                            file.type &&
                            file.type.startsWith(
                                "image/"
                            )
                        );
                    }
                );

            if (files.length === 0) {
                return;
            }

            const self = this;

            // Creamos los objetos temporales.
            const uploads = files.map(
                function (file, index) {
                    return {
                        id:
                            Date.now() +
                            "-" +
                            Math.random() +
                            "-" +
                            index,

                        file: file,

                        name: file.name,

                        progress: 0,

                        status: "Preparando...",

                        error: false
                    };
                }
            );

            this.setState(
                function (state) {
                    return {
                        uploads:
                            state.uploads.concat(
                                uploads
                            )
                    };
                }
            );

            // Subimos todos.
            uploads.forEach(
                function (upload) {

                    uploadImage(
                        upload.file,

                        function (progress) {

                            self.updateUpload(
                                upload.id,
                                {
                                    progress:
                                        progress,
                                    status:
                                        `Subiendo... ${progress}%`
                                }
                            );

                        }
                    )
                        .then(function (url) {

                            // Añadimos la URL al array
                            // que controla Decap.
                            const currentValue =
                                Array.isArray(
                                    self.props.value
                                )
                                    ? self.props.value
                                    : [];

                            self.props.onChange(
                                currentValue.concat(
                                    url
                                )
                            );

                            self.updateUpload(
                                upload.id,
                                {
                                    progress: 100,
                                    status:
                                        "✓ Subida"
                                }
                            );

                            // Quitamos la entrada temporal
                            // después de un momento.
                            setTimeout(
                                function () {

                                    self.removeUpload(
                                        upload.id
                                    );

                                },
                                1000
                            );

                        })
                        .catch(function (error) {

                            console.error(
                                "Cloudinary:",
                                error
                            );

                            self.updateUpload(
                                upload.id,
                                {
                                    status:
                                        "Error: " +
                                        error.message,

                                    error: true
                                }
                            );

                        });
                }
            );
        },

        updateUpload: function (id, changes) {

            this.setState(
                function (state) {

                    return {
                        uploads:
                            state.uploads.map(
                                function (upload) {

                                    if (
                                        upload.id === id
                                    ) {
                                        return {
                                            ...upload,
                                            ...changes
                                        };
                                    }

                                    return upload;
                                }
                            )
                    };
                }
            );
        },

        removeUpload: function (id) {

            this.setState(
                function (state) {

                    return {
                        uploads:
                            state.uploads.filter(
                                function (upload) {
                                    return (
                                        upload.id !== id
                                    );
                                }
                            )
                    };
                }
            );
        },

        handleInputChange: function (event) {

            this.handleFiles(
                event.target.files
            );

            event.target.value = "";
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

        removeImage: function (index) {

            const value =
                Array.isArray(this.props.value)
                    ? this.props.value
                    : [];

            const newValue =
                value.filter(
                    function (_, i) {
                        return i !== index;
                    }
                );

            this.props.onChange(
                newValue
            );
        },

        render: function () {

            const value =
                Array.isArray(this.props.value)
                    ? this.props.value
                    : [];

            const uploads =
                this.state.uploads || [];

            const self = this;

            return h(
                "div",
                {
                    className:
                        "xam-cloudinary"
                },

                // INPUT
                h(
                    "input",
                    {
                        id: this.props.forID,

                        className:
                            "xam-cloudinary-input",

                        type: "file",

                        accept: "image/*",

                        multiple: true,

                        onChange:
                            this.handleInputChange
                    }
                ),

                // DROPZONE
                h(
                    "label",
                    {
                        htmlFor:
                            this.props.forID,

                        className:
                            "xam-cloudinary-dropzone" +
                            (
                                this.state.dragging
                                    ? " dragging"
                                    : ""
                            ),

                        onDragOver:
                            this.handleDragOver,

                        onDragEnter:
                            this.handleDragOver,

                        onDragLeave:
                            this.handleDragLeave,

                        onDrop:
                            this.handleDrop
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

                // CONTADOR
                value.length > 0
                    ? h(
                        "div",
                        {
                            className:
                                "xam-cloudinary-count"
                        },
                        `${value.length} ${
                            value.length === 1
                                ? "imagen"
                                : "imágenes"
                        } seleccionada${
                            value.length === 1
                                ? ""
                                : "s"
                        }`
                    )
                    : null,

                // IMÁGENES YA SUBIDAS
                h(
                    "div",
                    {
                        className:
                            "xam-cloudinary-list"
                    },

                    value.map(
                        function (url, index) {

                            return h(
                                "div",
                                {
                                    className:
                                        "xam-cloudinary-item",

                                    key:
                                        url +
                                        "-" +
                                        index
                                },

                                h(
                                    "img",
                                    {
                                        className:
                                            "xam-cloudinary-preview",

                                        src: url,

                                        alt:
                                            `Imagen ${
                                                index + 1
                                            }`
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
                                        url
                                            .split("/")
                                            .pop()
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

                                        onClick:
                                            function () {
                                                self.removeImage(
                                                    index
                                                );
                                            },

                                        title:
                                            "Eliminar imagen"
                                    },
                                    "✕"
                                )
                            );
                        }
                    ),

                    // UPLOADS EN PROGRESO
                    uploads.map(
                        function (upload) {

                            return h(
                                "div",
                                {
                                    className:
                                        "xam-cloudinary-item",

                                    key:
                                        upload.id
                                },

                                h(
                                    "div",
                                    {
                                        className:
                                            "xam-cloudinary-preview",

                                        style: {
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center"
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
                                        upload.name
                                    ),

                                    h(
                                        "div",
                                        {
                                            className:
                                                "xam-cloudinary-status" +
                                                (
                                                    upload.error
                                                        ? " xam-cloudinary-error"
                                                        : ""
                                                )
                                        },
                                        upload.status
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
                                                        `${upload.progress}%`
                                                }
                                            }
                                        )
                                    )
                                )
                            );
                        }
                    )
                )
            );
        }
    });

    // ---------------------------------------------------------
    // Preview
    // ---------------------------------------------------------

    const CloudinaryPreview = createClass({

        render: function () {

            const value =
                Array.isArray(this.props.value)
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

                value.map(
                    function (url, index) {

                        return h(
                            "img",
                            {
                                key:
                                    url +
                                    index,

                                src: url,

                                alt:
                                    `Imagen ${
                                        index + 1
                                    }`,

                                style: {
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "6px"
                                }
                            }
                        );
                    }
                )
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
                "XAM Cloudinary Widget: CMS no está disponible."
            );

            return;
        }

        CMS.registerWidget(
            "cloudinary",

            CloudinaryControl,

            CloudinaryPreview
        );

        console.log(
            "XAM Cloudinary Widget registrado."
        );
    }

    if (
        typeof CMS !== "undefined"
    ) {

        registerWidget();

    } else {

        window.addEventListener(
            "load",
            registerWidget
        );
    }

})();