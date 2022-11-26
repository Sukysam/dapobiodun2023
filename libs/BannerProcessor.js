function BannerProcessor(event) {
    event.preventDefault();

    const payload = {
        first_name: document.getElementById("form-first-name").value,
        last_name: document.getElementById("form-last-name").value,
        occupation: document.getElementById("form-occupation").value,
        state: document.getElementById("form-state-residence").value,
        created_at: +new Date(),
    };

    // Save data to firebase firestore
    saveFormData(payload);

    // Prepare canvas for drawing
    const avatarElement = document.getElementById("form-photo-upload");
    const avatarLayerElement = document.getElementById("canvas-1");

    // let's load the image data
    const image = new Image();
    image.onload = () => {
        const { naturalWidth, naturalHeight } = image;
        const aspectRatio = AVATAR_SIZE / Math.min(naturalWidth, naturalHeight);
        const width = naturalWidth * aspectRatio;
        const height = naturalHeight * aspectRatio;

        // draw user photo to canvas
        avatarLayerElement.width = width;
        avatarLayerElement.height = height;
        const ctx = avatarLayerElement.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);

        // prepare text for drawing
        const textLayerElement = document.getElementById("text-layer-canvas");
        textLayerElement.width = BANNER_SIZE.width;
        textLayerElement.height = BANNER_SIZE.height;
        const textLayer = textLayerElement.getContext("2d");

        // write full name (fill)
        const fullName = `${payload.first_name} ${payload.last_name}`;
        textLayer.font = "bolder 64px sans-serif";
        textLayer.textAlign = "center";
        textLayer.fillStyle = "white";
        textLayer.fillText(fullName, BANNER_SIZE.width / 2, 870);

        // write full name (stroke)
        textLayer.lineWidth = 2;
        textLayer.strokeStyle = "black";
        textLayer.strokeText(fullName, BANNER_SIZE.width / 2, 870);

        // write occupation
        textLayer.font = "bold small-caps 42px Calibri";
        textLayer.fillStyle = "white";
        textLayer.lineWidth = 0;
        textLayer.fillText(payload.occupation, BANNER_SIZE.width / 2, 920);

        // Prepare for merger
        const mergeImages = window.mergeImages;
        let avatarLayer = avatarLayerElement.toDataURL();

        // Merge the banner 1
        let banner = document.getElementById("banner-img-1");
        mergeImages(
            [
                { src: avatarLayer, ...AVATAR_POSITION },
                { src: banner.src, x: 0, y: 0 },
                {
                    src: textLayerElement.toDataURL(),
                    x: 0,
                    y: 0,
                },
            ],
            BANNER_SIZE
        ).then((b64) => {
            document.getElementById("banner-img-1").src = b64;
            document.getElementById("download-button-1").href = b64;
        });

        // Merge the banner 2
        banner = document.getElementById("banner-img-2");
        mergeImages(
            [
                { src: avatarLayer, ...AVATAR_POSITION },
                { src: banner.src, x: 0, y: 0 },
                {
                    src: textLayerElement.toDataURL(),
                    x: 0,
                    y: 0,
                },
            ],
            BANNER_SIZE
        ).then((b64) => {
            banner.src = b64;
            document.getElementById("download-button-2").href = b64;
        });

        document.getElementById("form-section").style.display = "none";
        document.getElementById("download-section").style.display = "block";
        document.getElementById("download-button-1").style.display = "none";
    };

    image.src = window.URL.createObjectURL(avatarElement.files[0]);
}