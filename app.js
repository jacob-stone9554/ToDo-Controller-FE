/**
 * getItem() takes the number entered into the input field and calls the api to get the item with that ID
 * 
 * if the response is ok, populate the itemData div with content. 
 * Otherwise, display some sort of error message (404 or something went wrong)
 * 
 * set any other result content divs (updateItemData, deleteItemData) to empty, prevent clutter on the screen
 */
async function getItem() {
    const itemId = document.getElementById('itemId').value;
    const response = await fetch(`https://localhost:7156/Item/${itemId}`);

    if (response.ok) {
        const item = await response.json();
        document.getElementById('itemData').innerHTML = `
            <h2>Item Details</h2>
            <p>ID: ${item.id}</p>
            <p>Name: ${item.name}</p>
            <p>Description: ${item.description}</p>
        `;
    } else if (response.status === 404) {
        document.getElementById('itemData').innerHTML = `
            <h2>Item Not Found</h2>
            <p>No item found with ID ${itemId}</p>
        `;
    } else {
        document.getElementById('itemData').innerHTML = `
            <h2>Error</h2>
            <p>Something went wrong while retrieving the item data.</p>
        `;
    }
    document.getElementById('updateItemData').innerHTML = '';
    document.getElementById('deleteItemData').innerHTML = '';
    document.getElementById('result').innerHTML = '';
}

/**
 * getAllItems() retrieves all items in the DB from the API
 * 
 * if the response is ok, populate the itemData div with the information.
 * for each item, add the item id, name, description and a break line
 * 
 * otherwise, display an error message.
 * 
 * set the other result divs (updateItemData, deleteItemData, etc.) to empty to
 *      prevent clutter on the screen
 */
async function getAllItems() {
    const response = await fetch('https://localhost:7156/Item');

    if(response.ok) {
        const items = await response.json();
        const ItemDataDiv = document.getElementById('itemData');
        ItemDataDiv.innerHTML = '<h2>All Items</h2>';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>ID: ${item.id}</p>
                <p>Name: ${item.name}</p>
                <p>Description: ${item.description}</p>
                <hr>
            `;
            ItemDataDiv.appendChild(itemDiv);
        });
    }
    else {
        document.getElementById('itemData').innerHTML = `
            <h2>Error</h2>
            <p>Something went wrong while retrieving the item's data</p>
        `;
    };

    document.getElementById('updateItemData').innerHTML = '';
    document.getElementById('deleteItemData').innerHTML = '';
    document.getElementById('result').innerHTML = '';
}

/**
 * createNewItem(event) creates a new item and attaches it to a POST request to the API
 * the function listens for an event (click on the submit button) before it executes.
 * 
 * get the three values in the field, assign them to an object item.
 * POST that item to the API.
 * 
 * If the response is ok (post was successful) display the newly created item.
 * otherwise, display an error message.
 * 
 * set the other result divs (updateItemData, deleteItemData, etc.) to empty to
 *      prevent clutter on the screen
 */
async function createNewItem(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const name = document.getElementById('itemNameIn').value;
    const descr = document.getElementById('itemDescrIn').value;
    const type = document.getElementById('itemTypeIn').value;

    const item = {
        name: name,
        description: descr,
        type: type,
        isCompleted: false
    };

    try {
        const response = await fetch('https://localhost:7156/Item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        if (response.ok) {
            const createdItem = await response.json();
            document.getElementById('result').innerHTML = `
                <h2>Item Created Successfully!</h2>
                <p>ID: ${createdItem.id}</p>
                <p>Name: ${createdItem.name}</p>
                <p>Description: ${createdItem.description}</p>
            `;
        } else {
            document.getElementById('result').innerHTML = `
                <h2>ERROR!</h2>
                <p>Failed to create item. Status: ${response.status}</p>
            `;
        }
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <h2>ERROR!</h2>
            <p>Failed to create item. Error: ${error.message}</p>
        `;
        console.error("ERROR CAUGHT BY THE CATCH BLOCK", error);
    }

    document.getElementById('itemData').innerHTML = '';
    document.getElementById('updateItemData').innerHTML = '';
    document.getElementById('deleteItemData').innerHTML = '';
}

// Attach the submit event to the form
document.getElementById('addNewItem').addEventListener('submit', createNewItem);

/**
 * getUpdatedItem() fetches the desired item to update from the API
 * 
 * if the response is ok, display a form where the user can update the data and submit it.
 * otherwise, display an error message.
 * 
 * set the other results divs (itemData, deleteItemData, etc.) to empty to keep the screen free from clutter.
 */
async function getUpdateItem() {
    const itemId = document.getElementById('updateItemId').value;

    if (itemId) {
        try {
            const response = await fetch(`https://localhost:7156/Item/${itemId}`);
            if (response.ok) {
                const item = await response.json();
                document.getElementById('updateItemData').innerHTML = `
                    <h2>Update Item Details</h2>
                    <p>ID: ${item.id}</p>
                    <p>Name: ${item.name}</p>
                    <p>Description: ${item.description}</p>
                    <input type="text" id="updateItemName" placeholder="New Name" value="${item.name}">
                    <input type="text" id="updateItemDescr" placeholder="New Description" value="${item.description}">
                    <input type="text" id="updateItemType" placeholder="New Type" value="${item.type}">
                    <button onclick="saveUpdatedItem(${item.id})">Save Changes</button>
                `;
            } else {
                document.getElementById('updateItemData').innerHTML = `
                    <h2>Item Not Found</h2>
                    <p>No item found with ID ${itemId}</p>
                `;
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        }

        document.getElementById('itemData').innerHTML = '';
        document.getElementById('deleteItemData').innerHTML = '';
    }
}

/**
 * saveUpdatedItem(id) takes the id of the retrieved item to update and the values entered in 
 *      the input fields and stores them in an object updatedItem. updatedItem is sent with a PUT
 *      request to the API.
 * 
 * if the response is ok, then display the updated item.
 * otherwise, display an error message.
 */
async function saveUpdatedItem(id) {
    const name = document.getElementById('updateItemName').value;
    const description = document.getElementById('updateItemDescr').value;
    const type = document.getElementById('updateItemType').value;

    const updatedItem = {
        id,
        name,
        description,
        type,
        isCompleted: false
    };

    try {
        const response = await fetch(`https://localhost:7156/Item/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });

        if (response.ok) {
            const item = await response.json();
            document.getElementById('updateItemData').innerHTML = `
                <h2>Item Updated Successfully!</h2>
                <p>ID: ${item.id}</p>
                <p>Name: ${item.name}</p>
                <p>Description: ${item.description}</p>
            `;
        } else {
            console.error("Failed to update item. Status:", response.status);
        }
    } catch (error) {
        console.error("Error updating item:", error);
    }
}

// Attach the updateItem function to the blur event of the input field
document.getElementById('updateItemId').addEventListener('blur', getUpdateItem);

/**
 * getDeleteItem fetches the item to be deleted and displays it to the user
 * 
 * if the response is okay, display the item to be deleted and show a button to send the delete request.
 * otherwise, display an error message.
 * 
 * set the other result divs (updateItemData, itemData, etc.) to empty to
 *      prevent clutter on the screen
 */
async function getDeleteItem() {
    const itemId = document.getElementById('deleteItemId').value;

    if (itemId) {
        try {
            const response = await fetch(`https://localhost:7156/Item/${itemId}`);
            if (response.ok) {
                const item = await response.json();
                document.getElementById('deleteItemData').innerHTML = `
                    <h2>Confirm Deletion</h2>
                    <p>ID: ${item.id}</p>
                    <p>Name: ${item.name}</p>
                    <p>Description: ${item.description}</p>
                    <button onclick="deleteItem(${item.id})">Delete This Item</button>
                `;
            } else {
                document.getElementById('deleteItemData').innerHTML = `
                    <h2>Item Not Found</h2>
                    <p>No item found with ID ${itemId}</p>
                `;
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        }

        document.getElementById('itemData').innerHTML = '';
        document.getElementById('updateItemData').innerHTML = '';
        document.getElementById('result').innerHTML = '';
    }
}

/**
 * deleteItem(id) deletes an item from the from the database with a DELETE request.
 * it executes when the delete button is clicked.
 * 
 * if the response is ok, display a success message.
 * otherwise, display an error message.
 */
async function deleteItem(id) {
    try {
        const response = await fetch(`https://localhost:7156/Item/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.getElementById('deleteItemData').innerHTML = `
                <h2>Item Deleted Successfully!</h2>
                <p>The item with ID ${id} has been removed from the database.</p>
            `;
        } else {
            document.getElementById('deleteItemData').innerHTML = `
                <h2>Error</h2>
                <p>Failed to delete the item. Status: ${response.status}</p>
            `;
        }
    } catch (error) {
        console.error("Error deleting item:", error);
    }
}

// Attach the getDeleteItem function to the blur event of the input field
document.getElementById('deleteItemId').addEventListener('blur', getDeleteItem);
