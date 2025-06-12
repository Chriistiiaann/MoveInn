export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "localhost:7023";
export const API_BASE_SOCKET_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || `wss://${API_BASE}`;

export const API_BASE_URL = `https://${API_BASE}/api`;
export const API_BASE_IMAGE_URL = `https://${API_BASE}/`;


const API_AUTH = `${API_BASE_URL}/Auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/Login`;
export const API_AUTH_REGISTER = `${API_AUTH}/Register`;


const API_USER = `${API_BASE_URL}/User`;
export const API_GET_ALL_USERS = `${API_USER}/All`;
export const API_SEARCH_USERS = `${API_USER}/SearchUsers`;
export const API_USER_COUNTRIES = `${API_USER}/countries`;
export const API_USER_CITIES = (country) => `${API_USER}/cities/${country}`;
export const API_GET_USER = (id) => `${API_USER}/${id}`;
export const API_UPDATE_USER = (id) => `${API_USER}/Update/${id}`;
export const API_DELETE_USER = (id) => `${API_USER}/Delete/${id}`;
export const API_UPDATE_SOCIALMEDIA = (id) => `${API_USER}/${id}/SocialMedias`;
export const API_UPDATE_LANGUAGES = (id) => `${API_USER}/${id}/Languages`;

const API_RECOMMENDATION = `${API_BASE_URL}/Recommendation`;
export const API_ALL_RECOMMENDATION = `${API_RECOMMENDATION}/AllRecommendations`;
export const API_SEARCH_RECOMMENDATION = `${API_RECOMMENDATION}/SearchRecommendation`;
export const API_DELETE_RECOMMENDATION = (id) => `${API_RECOMMENDATION}/${id}`;
export const API_CREATE_RECOMMENDATION = `${API_RECOMMENDATION}`;
export const API_RECOMMENDATION_COUNTRIES = `${API_RECOMMENDATION}/countries`;
export const API_RECOMMENDATION_CITIES = (country) => `${API_RECOMMENDATION}/cities/${country}`;

export const API_EVENTS = `${API_BASE_URL}/Event`;
export const API_CREATE_EVENT = `${API_BASE_URL}/Event`;
export const API_DELETE_EVENT = (id) => `${API_EVENTS}/${id}`;
export const API_JOIN_EVENT = (eventId, userId) => `${API_EVENTS}/${eventId}/join?userId=${userId}`
export const API_LEAVE_EVENT = (eventId, userId) => `${API_EVENTS}/${eventId}/leave?userId=${userId}`;
export const API_GET_USER_EVENTS = (userId) => `${API_EVENTS}/user/${userId}`;
export const API_SEARCH_EVENTS = `${API_EVENTS}/SearchEvents`;
export const API_EVENTS_COUNTRIES = `${API_EVENTS}/countries`;
export const API_EVENTS_CITIES = (country) => `${API_EVENTS}/cities/${country}`;

const API_RESERVATION = `${API_BASE_URL}/Reservation`;
export const API_GET_RESERVATION = (id) => `${API_RESERVATION}/${id}`;
export const API_GET_RESERVATIONS_BY_USER = (userId) => `${API_RESERVATION}/user/${userId}`;
export const API_CREATE_RESERVATION = `${API_RESERVATION}/CreateReservation`;
export const API_UPDATE_RESERVATION = (id) => `${API_RESERVATION}/Update/${id}`;
export const API_DELETE_RESERVATION = (id) => `${API_RESERVATION}/${id}`;


const API_ACCOMMODATION = `${API_BASE_URL}/Accommodations`;
export const API_ALL_ACCOMMODATION = `${API_ACCOMMODATION}/AllAccommodations`;
export const API_GET_ACCOMMODATION = (id) => `${API_ACCOMMODATION}/${id}`;
export const API_CREATE_ACCOMMODATION = `${API_ACCOMMODATION}/CreateAccommodation`;
export const API_UPDATE_ACCOMMODATION = (id) => `${API_ACCOMMODATION}/Update/${id}`;
export const API_DELETE_ACCOMMODATION = (id) => `${API_ACCOMMODATION}/${id}`;
export const API_GET_UNAVAILABLEDATESBYACCOMMODATION = (id) => `${API_ACCOMMODATION}/UnavailableDates/${id}`;
const API_ACOMMODATION = `${API_BASE_URL}/Accommodations`;
export const API_SEARCH_ACOMMODATION = `${API_ACOMMODATION}/SearchAccommodation`;
export const API_ACCOMMODATION_COUNTRIES = `${API_ACOMMODATION}/countries`;
export const API_GET_ACOMMODATION = (id) => `${API_ACOMMODATION}/${id}`;
export const API_ALL_ACOMMODATIONS = `${API_ACOMMODATION}/AllAccommodations`;
export const API_ACCOMMODATION_CITIES = (country) => `${API_ACOMMODATION}/cities/${country}`;

const API_REVIEWS = `${API_BASE_URL}/Reviews`;
export const API_GET_ALL_REVIEWS = `${API_REVIEWS}`;
export const API_GET_REVIEWS = (id) => `${API_REVIEWS}/accommodation/${id}`;
export const API_CREATE_REVIEW = `${API_REVIEWS}`;
export const API_DELETE_REVIEW = (id) => `${API_REVIEWS}/${id}`;

const API_PAYMENT = `${API_BASE_URL}/Payment`;
export const API_CREATE_PAYMENT = `${API_PAYMENT}/CreatePaymentIntent`;
export const API_GET_RECOMMENDATION = (id) => `${API_RECOMMENDATION}/${id}`;


const API_FORUMS = `${API_BASE_URL}/Forum`;
export const API_ALL_FORUMS = `${API_FORUMS}/forums`;
export const API_FORUM_THREADS_BY_FORUM_ID = (forumId) => `${API_FORUMS}/thread/forum/${forumId}`;
export const API_FORUM_MESSAGES_BY_THREAD_ID = (threadId) => `${API_FORUMS}/message/thread/${threadId}`;
export const API_FORUM_POST_FORUM = `${API_FORUMS}/forum`;
export const API_FORUM_POST_THREAD = `${API_FORUMS}/thread`;
export const API_FORUM_POST_RESPONSE_TO_THREAD = `${API_FORUMS}/createMessageInThread`;
export const API_FORUM_SEARCH_FORUMS = `${API_FORUMS}/SearchForums`;
export const API_FORUM_COUNTRIES = `${API_FORUMS}/countries`;
export const API_FORUM_DELETE = (id) => `${API_FORUMS}/${id}`;


const API_LOCATION = `${API_BASE_URL}/Location`;
export const API_GET_COUNTRYSEARCH = (query) => `${API_LOCATION}/CountriesSearch?query=${query}`;
export const API_GET_CITYSEARCH = (country, query) =>`${API_LOCATION}/CitiesSearch?country=${country}&query=${query}`;

const API_HOSTS = `${API_BASE_URL}/Hosts`;
export const API_GET_HOSTS = `${API_HOSTS}`;
export const API_HOST_POST_REQUEST = `${API_HOSTS}`;
export const API_HOST_GET_REQUESTS = `${API_HOSTS}/requests`;
export const API_HOST_REQUEST_ACCEPT = (id) => `${API_HOSTS}/${id}/approve`;
export const API_HOST_REQUEST_REJECT = (id) => `${API_HOSTS}/${id}/reject`;
export const API_HOST_SEARCH_HOSTS = `${API_HOSTS}/SearchHosts`;
export const API_HOST_COUNTRIES = `${API_HOSTS}/countries`;
export const API_HOST_CITIES = (country) => `${API_HOSTS}/cities/${country}`;

const API_ADMIN = `${API_BASE_URL}/Admin`;
export const API_ADMIN_MODIFY_ROLE_USER = (id, role) => `${API_ADMIN}/user/${id}?newRole=${role}`;
export const API_ADMIN_DELETE_REVIEW = (id) => `${API_ADMIN}/review/${id}`;
export const API_ADMIN_DELETE_RESERVATION = (id) => `${API_ADMIN}/reservation/${id}`;
export const API_ADMIN_DELETE_ACCOMMODATION = (id) => `${API_ADMIN}/accommodation/${id}`;
export const API_ADMIN_DELETE_RECOMMENDATION = (id) => `${API_ADMIN}/recommendation/${id}`;
export const API_ADMIN_DELETE_EVENT = (id) => `${API_ADMIN}/event/${id}`;
export const API_ADMIN_DELETE_FORUM = (id) => `${API_ADMIN}/forum/${id}`;

//User endpoints
export const API_REVIEWS_USER = (id) => `${API_REVIEWS}/user/${id}`;
export const API_RESERVATIONS_USER = (id) => `${API_RESERVATION}/user/${id}`;
export const API_RECOMMENDATIONS_USER = (id) => `${API_RECOMMENDATION}/user/${id}`; 
export const API_ACCOMMODATIONS_USER = (id) => `${API_ACCOMMODATION}/user/${id}`;
export const API_EVENTS_USER = (id) => `${API_EVENTS}/user/${id}`;
export const API_FORUMS_USER = (id) => `${API_FORUMS}/user/${id}`;

export const API_USER_FOLLOWERS = (id) => `${API_USER}/${id}/followers`;
export const API_USER_FOLLOWING = (id) => `${API_USER}/${id}/followings`;

export const API_CHAT_GET_CONTACTS = (id) => `${API_BASE_URL}/Chat/${id}`;

