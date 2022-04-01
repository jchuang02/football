import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { addFaveLeague, addFaveTeam } from "../state/actions/favorites";

const db = getFirestore();
export function addFollowsToFirebase(followed, userId) {
  try {
    setDoc(doc(db, "userFollows", userId), {
      teams: followed.teams,
      leagues: followed.leagues,
    });
  } catch (e) {
    console.log(e);
  }
}

export async function getFollowsFromFirebase(followed, dispatch, userId) {
  try {
    const docRef = doc(db, "userFollows", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      userData.leagues.forEach((league) => {
        dispatch(addFaveLeague(league));
      });
      userData.teams.forEach((team) => {
        dispatch(addFaveTeam(team));
      });
    }
  } catch (e) {
    console.log(e);
  }
}
