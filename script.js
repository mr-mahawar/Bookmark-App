const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteName = document.getElementById('website-name');
const websiteUrl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
let bookmarks = [];

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteName.focus();
}


// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click',(e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    // Not Valid
    if (!nameValue || !urlValue) {
        alert('Please Submit Values for Both Fields');
        return false;
    }

    if (!urlValue.match(regex)) {
        alert('Please Provide a Valid Web Address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all Bookmark Elements
    bookmarksContainer.textContent = '';
    // Build Items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        
        // Item
        const item = document.createElement('div');
        item.classList.add('item');

        // Delete Icon
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash-alt');
        deleteIcon.setAttribute('title', 'Delete Bookmark');
        deleteIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // FavIcon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // FavIcon
        const favIcon = document.createElement('img');
        favIcon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favIcon.setAttribute('alt', 'FavIcon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Append to Bookmarks Container
        linkInfo.append(favIcon, link);
        item.append(deleteIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // Update Bookmarks Array in Local Storage and Re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Fetch Bookmarks from Local Storage
function fetchBookmarks() {
    // Get Bookmarks from Local Storage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        // Create Bookmarks Array in Local Storage
        bookmarks = [
            {
                name: 'Tilak Mahawar',
                url: 'https://github.com/mr-mahawar',
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Collect data from Bookmark From
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteName.value;
    let urlValue = websiteUrl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }

    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteName.focus();
}

// Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load Fetch Bookmarks
fetchBookmarks();
