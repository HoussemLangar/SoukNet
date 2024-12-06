const { app } = require('@azure/functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('../../serviceAccountKey.json')),  
    databaseURL: "https://souknet-ce8dc.firebaseio.com" 
});

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const db = admin.firestore();
        let collectionsData = {};

        try {
            const collections = await db.listCollections();
            for (const collection of collections) {
                const collectionName = collection.id;
                const snapshot = await collection.get();
                let documents = [];
                snapshot.forEach(doc => {
                    documents.push({ id: doc.id, ...doc.data() });
                });
                collectionsData[collectionName] = documents;
            }

            return {
                status: 200,
                body: JSON.stringify(collectionsData), 
                headers: { 'Content-Type': 'application/json' }  
            };
        } catch (error) {
            context.log('Erreur lors de la récupération des collections :', error);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Erreur lors de la récupération des collections.' }),  
                headers: { 'Content-Type': 'application/json' }
            };
        }
    }
});
