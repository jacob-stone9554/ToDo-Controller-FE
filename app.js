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

// async function createNewItem(event) {
//     document.getElementById('addNewItem').addEventListener('submit', async function(event) {
//         event.preventDefault();

//         const name = document.getElementById('itemNameIn');
//         const descr = document.getElementById('itemDescrIn');
//         const type = document.getElementById('itemTypeIn');

//         const item = {
//             name: name,
//             description: descr,
//             type: type,
//             isCompleted: false //an item will not be completed when you create it. Otherwise, why create it?
//         }

//         try {
//             const response = await fetch('https://localhost:7156/Item', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(item)
//             });
//             console.log("Attempting to send data");

//             if(response.ok) {
//                 const createdItem = await response.json();
//                 document.getElementById('result').innerHTML = `
//                     <h2>Item Created Successfully!</h2>
//                     <p>ID: ${createdItem.id}</p>
//                     <p>Name: ${createdItem.name}</p>
//                     <p>Description ${createdItem.description}</p>
//                 `
//             }
//         } catch(error) {
//             document.getElementById('result').innerHTML = `
//                 <h2>ERROR!</h2>
//                 <p>Failed to create item. Status: ${response.status}</p>
//             `
//             console.log("ERROR CAUGHT BY THE CATCH BLOCK")
//         }

//     })
// }

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