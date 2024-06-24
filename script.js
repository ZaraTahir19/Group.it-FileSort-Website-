const folders = {};

// Addind event listener to file input
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('browseFiles').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

// Adding event listeners for drag-and-drop functionality
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dropzone-hover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dropzone-hover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dropzone-hover');
    const files = event.dataTransfer.files;
    handleFiles(files);
});

function handleFileUpload(event) {
    const files = event.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    let newFiles = [];
    for (let file of files) {
        const fileType = file.name.split('.').pop().toLowerCase();
        if (!folders[fileType]) {
            folders[fileType] = [];
        }
        const fileExists = folders[fileType].some(existingFile => existingFile.name === file.name);
        if (!fileExists) {
            folders[fileType].push(file);
            newFiles.push(file);
        } else {
            alert(`The file "${file.name}" has already been uploaded.`);
        }
    }
    if (newFiles.length > 0) {
        simulateFileUpload(newFiles);
    }
}

function simulateFileUpload(files) {
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const fileCount = document.getElementById('fileCount');
    const totalFiles = files.length;
    let uploadedFiles = 0;

    progressContainer.classList.remove('hidden');
    fileCount.textContent = `Uploading 0/${totalFiles} file(s)`;

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            displayFolders();
            progressContainer.classList.add('hidden');
        }

        uploadedFiles = Math.min(Math.ceil((progress / 100) * totalFiles), totalFiles);
        fileCount.textContent = `Uploading ${uploadedFiles}/${totalFiles} file(s)`;
    }, 300);
}

// Updating the UI with the categorized files
function displayFolders() {
    const foldersContainer = document.getElementById('folders');
    foldersContainer.innerHTML = ''; // Clear previous content
    for (let [folderName, files] of Object.entries(folders)) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'p-2 border rounded bg-[#fef5eb] mb-4';

        const folderHeader = document.createElement('div');
        folderHeader.className = 'flex justify-between items-center mb-2';

        const folderTitle = document.createElement('h2');
        folderTitle.className = 'text-lg font-semibold';
        folderTitle.textContent = `.${folderName} files (${formatBytes(getFolderSize(files))})`;

        const downloadButton = document.createElement('button');
        downloadButton.className = 'Btn flex flex-col items-center justify-center bg-orange-600 text-white rounded-full w-7 h-7 relative transition duration-300 shadow-md';
        downloadButton.innerHTML = 
        `   <svg class="svgIcon fill-white transition duration-300" viewBox="0 0 384 512" height="0.7em" width="6em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
            <span class="icon2 border-b-2 border-l-2 border-r-2 border-white w-3 h-1 mt-1"></span>
            <span class="tooltip"></span>   `;
        downloadButton.addEventListener('mouseover', () => {
           
            downloadButton.classList.remove('bg-orange-600');
            downloadButton.classList.add('bg-gray-800');
            // downloadButton.querySelector('.tooltip').classList.add('opacity-0');
            // downloadButton.querySelector('.tooltip').classList.remove('opacity-100');
            downloadButton.querySelector('.svgIcon').classList.add('fill-orange-600');
            downloadButton.querySelector('.svgIcon').classList.remove('fill-white');
            downloadButton.querySelector('.icon2').classList.add('border-orange-600');
            downloadButton.querySelector('.icon2').classList.remove('border-white');
        });
        downloadButton.addEventListener('mouseout', () => {

            // downloadButton.querySelector('.tooltip').classList.add('orange-600');
           // downloadButton.querySelector('.tooltip').classList.remove('opacity-100');
              downloadButton.classList.remove('bg-gray-800');
            downloadButton.classList.add('bg-orange-600');
            downloadButton.querySelector('.svgIcon').classList.add('fill-white');
            downloadButton.querySelector('.svgIcon').classList.remove('fill-orange-600');
            downloadButton.querySelector('.icon2').classList.add('border-white');
            downloadButton.querySelector('.icon2').classList.remove('border-orange-600');
        });
        downloadButton.addEventListener('click', () => downloadFolder(folderName, files));

        folderHeader.appendChild(folderTitle);
        folderHeader.appendChild(downloadButton);

        const filesContainer = document.createElement('div');
        filesContainer.className = 'flex flex-wrap gap-2';

        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.className = 'p-2 border rounded bg-[#fce5ce] w-full flex justify-between items-center';

            const fileNameContainer = document.createElement('div');
            fileNameContainer.className = 'file-info flex items-center justify-between'; // Using flex for layout
            fileNameContainer.title = file.name; // Adding tooltip with full file name

            const fileName = document.createElement('span');
            fileName.className = 'file-name truncate max-w-[200px]'; 
            fileName.textContent = file.name;

            const fileSize = document.createElement('span');
            fileSize.className = 'file-size text-gray-500 text-xs ml-2'; 
            fileSize.textContent = `(${formatBytes(file.size)})`;

            fileNameContainer.appendChild(fileName);
            fileNameContainer.appendChild(fileSize);
            fileItem.appendChild(fileNameContainer);

            // Updating delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn relative border-none bg-transparent flex items-center';
            deleteButton.innerHTML = `
                <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" class="icon">
                    <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                </svg>
            `;
            deleteButton.addEventListener('click', () => deleteFile(folderName, file));

            fileItem.appendChild(deleteButton);
            filesContainer.appendChild(fileItem);
        }

        folderDiv.appendChild(folderHeader);
        folderDiv.appendChild(filesContainer);
        foldersContainer.appendChild(folderDiv);
    }
}

// Helper function to calculate folder size
function getFolderSize(files) {
    return files.reduce((total, file) => total + file.size, 0);
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Delete file from the folder
function deleteFile(folderName, file) {
    const folderFiles = folders[folderName];
    const updatedFiles = folderFiles.filter(existingFile => existingFile.name !== file.name);
    folders[folderName] = updatedFiles;

    if (updatedFiles.length === 0) {
        delete folders[folderName]; // Removing the folder if it has no files
    }

    displayFolders();
}

// Downloading the specified folder as a ZIP file
function downloadFolder(folderName, files) {
    const zip = new JSZip();
    const folder = zip.folder(folderName);

    files.forEach(file => {
        folder.file(file.name, file);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${folderName}.zip`;
        link.click();
    }); 
}
////////////////////////////////////////////////////////////////////////
