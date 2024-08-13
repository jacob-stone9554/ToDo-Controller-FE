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
}

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
}

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
}

// Attach the submit event to the form
document.getElementById('addNewItem').addEventListener('submit', createNewItem);

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
    }
}

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

// Function to fetch and display the item to be deleted
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

                document.getElementById('itemData').innerHTML = '';
            } else {
                document.getElementById('deleteItemData').innerHTML = `
                    <h2>Item Not Found</h2>
                    <p>No item found with ID ${itemId}</p>
                `;
            }
        } catch (error) {
            console.error("Error fetching item:", error);
        }
    }
}

// Function to delete the item
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
