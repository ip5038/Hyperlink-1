import { collection, getDocs } from 'firebase/firestore'
import firebase from './firebase'

// getLike is used to get only listings that user has liked. Pass true for parameter when we creat the 'liked lisitings page'. If its false
// then it will get only listings that the user has not disliked (for feed page)
export async function getCollection(user, name, getLiked) {
    try {
        const querySnapshot = await getDocs(collection(firebase.db, name));
        const listings = [];
        const res = querySnapshot.forEach((doc) => { 
            const lst = doc.data()
            if(getLiked === true) { 
                if(lst.likes.indexOf(user.uid) === 0) {
                    listings.push(lst) 
                }
            } else if(lst.dislikes.indexOf(user.uid) === -1) {
                listings.push(lst) 
            }
        });
        return listings;        
    } catch(error) {
        console.error(error);
        return -1;
    }
}