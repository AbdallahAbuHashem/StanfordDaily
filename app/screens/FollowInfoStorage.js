import { AsyncStorage } from "react-native"
import { STRINGS } from '../assets/constants.js'
import { Notifications } from "expo";

export async function getToken() {
    let token = await Notifications.getExpoPushTokenAsync();
    if (__DEV__) {
        console.log(token);
    }
    return token;
}

export async function getCategoriesFollowed() {
    return JSON.parse(await AsyncStorage.getItem('categories_followed') || "[]");
}

export async function getAuthorsFollowed() {
    return JSON.parse(await AsyncStorage.getItem('authors_followed') || "[]");
}

export async function getLocationsFollowed() {
    return JSON.parse(await AsyncStorage.getItem('locations_followed') || "[]");
}

export async function getNotificationSettings() {
    return JSON.parse(await AsyncStorage.getItem('notification_settings') || "[]");
}

export async function followCategory(category_id) {
    let categories_followed = await getCategoriesFollowed(); // store an array
    categories_followed.push(category_id);                                                       // add category_id to categories_followed
    await updateBackend();
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

export async function unfollowCategory(category_id) {
    let categories_followed = await getCategoriesFollowed(); 
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) categories_followed.splice(index, 1);                                     // remove category_id from list
    await updateBackend();
    return await AsyncStorage.setItem('categories_followed', JSON.stringify(categories_followed));
}

export async function followAuthor(author_id) {
    let authors_followed = await getAuthorsFollowed();  
    authors_followed.push(author_id);                                                        // add author_id to authors_followed
    await updateBackend();
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

export async function unfollowAuthor(author_id) {
    let authors_followed = await getAuthorsFollowed(); 
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) authors_followed.splice(index, 1);                                       // remove author_id from list
    await updateBackend();
    return await AsyncStorage.setItem('authors_followed', JSON.stringify(authors_followed));
}

export async function followLocation(location_id) {
    let locations_followed = await getLocationsFollowed();  
    locations_followed.push(location_id);                                                        
    await updateBackend();
    return await AsyncStorage.setItem('locations_followed', JSON.stringify(locations_followed));
}

export async function unfollowLocation(location_id) {
    let locations_followed = await getLocationsFollowed(); 
    var index = locations_followed.indexOf(location_id);
    if (index !== -1) locations_followed.splice(index, 1);                                       
    await updateBackend();
    return await AsyncStorage.setItem('locations_followed', JSON.stringify(locations_followed));
}

export async function isFollowingCategory(category_id) {
    let categories_followed = await getCategoriesFollowed();
    var index = categories_followed.indexOf(category_id);
    if (index !== -1) return true;
    else return false;
}

export async function isFollowingAuthor(author_id) {
    authors_followed = await getAuthorsFollowed();
    var index = authors_followed.indexOf(author_id);
    if (index !== -1) return true;
    else return false;
}

export async function isFollowingLocation(location_id) {
    locations_followed = await getLocationsFollowed();
    var index = locations_followed.indexOf(location_id);
    if (index !== -1) return true;
    else return false;
}

export async function addNotificationSetting(notification_id) {
    let notification_settings = await getNotificationSettings();  
    notification_settings.push(notification_id);                                                        
    await updateBackend();
    return await AsyncStorage.setItem('notification_settings', JSON.stringify(notification_settings));
}

export async function removeNotificationSetting(notification_id) {
    let notification_settings = await getNotificationSettings(); 
    var index = notification_settings.indexOf(notification_id);
    if (index !== -1) notification_settings.splice(index, 1);                                     // remove notification option from list
    await updateBackend();
    return await AsyncStorage.setItem('notification_settings', JSON.stringify(notification_settings));
}

export async function isBeingNotified(notification_id) {
    let notification_settings = await getNotificationSettings();
    var index = notification_settings.indexOf(notification_id);
    if (index !== -1) return true;
    else return false;
}

async function updateBackend() {
    let response = await fetch(STRINGS.DAILY_URL + 'wp-json/tsd/v1/push-notification/users/' + await getToken(), {
        method: 'PUT',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subscribing: {
                list: await getNotificationSettings(),
                category_ids: await getCategoriesFollowed(),
                author_ids: await getAuthorsFollowed(),
                location_ids: await getLocationsFollowed()
            },
        }),
    });
    // Todo: add error handling here.
}
