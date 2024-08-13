async function getItem() {
    const itemId = document.getElementById('itemId').value;
    const response = await fetch(`https://localhost:7068/item/${itemId}`);

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