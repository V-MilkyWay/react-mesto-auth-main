import React from 'react';
import Header from './Header.js';
import Login from './Login.js';
import Register from './Register.js'
import Main from './Main.js';
import Footer from './Footer.js';
import api from '../utils/api.js';
import * as Auth from '../Auth.js';
import ImagePopup from './ImagePopup.js';
import ProtectedRoute from "./ProtectedRoute.js"
import { Route, Link, withRouter, useHistory } from 'react-router-dom';
import PopupWithForm from './PopupWithForm.js';
import AddPlacePopup from './AddPlacePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import InfoTooltip from './InfoTooltip.js'

function App() {
    const [cards, setCards] = React.useState([]);
    const [currentUser, setCurrentUser] = React.useState({});
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
    const [isEditAgreePopupOpen, setEditAgreePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({ bool: false, link: '' });
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [email, setEmail] = React.useState('');

    React.useEffect(() => {
        function initialCards() {
            api.initCardsFromServer()
                .then((result) => {
                    setCards([...result.reverse()])
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        initialCards();
    }, []);

    React.useEffect(() => {
        function getUserInfo() {
            api.initialUsers()
                .then((result) => {
                    setCurrentUser(
                        result
                    );
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        getUserInfo();
    }, []);

    function handleCardClick(props) {
        setSelectedCard({
            bool: true,
            link: props
        });
    }
    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setEditAvatarPopupOpen(false);
        setEditAgreePopupOpen(false);
        setSelectedCard({
            bool: false,
            link: '',
        });
    }

    function handleUpdateUser(data) {
        api.loadingUserInfoOnServer({ name: data.name, about: data.about }).then((result) => {
            setCurrentUser(result);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleUpdateAvatar(data) {
        api.loadingNewAvatarOnServer(data).then((result) => {
            setCurrentUser(result);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }


    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleCardDelete(card) {
        api.deleteCardFromServer(card._id).then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id));
        }).catch((err) => {
            console.log(err);
        });
    }


    function handleAddPlaceSubmit(data) {
        api.loadingNewCardOnServer(data).then((newCard) => {
            setCards([...cards, newCard]);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        });
    }

    function handleLogin() {
        setLoggedIn(true);
    }

    function componentDidMount() {
        tokenCheck()
    };
    const history = useHistory();
    function tokenCheck() {
        // если у пользователя есть токен в localStorage,
        // эта функция проверит валидность токена
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            // проверим токен
            Auth.getContent(jwt).then((res) => {
                if (res) {
                    setEmail(res.data.email)
                    // авторизуем пользователя
                    setLoggedIn(true);
                    history.push("/");
                }
            });
        }
    }

    function signOut() {
        localStorage.removeItem('jwt');
        history.push('/login');
        setLoggedIn(false);
    }
    componentDidMount();

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <InfoTooltip onClose={closeAllPopups} />
                <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
                <AddPlacePopup onAddPlaceSubmit={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                <PopupWithForm type="deletion" isOpen={isEditAgreePopupOpen ? 'popup_opened' : ''} name="formAgree" title="Вы уверены?" text="Да" />
                <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
                <Route path="/sign-up">
                    <Register />
                </Route>
                <Route path="/sign-in">
                    <Login handleLogin={handleLogin} />
                </Route>
                <ProtectedRoute
                    exact path="/"
                    children={
                        <>
                            <h2 className="header__email-info">{email}</h2>
                            <Link onClick={signOut} className="header__link" to="/sign-in">
                                Выйти
                            </Link>
                        </>
                    }
                    loggedIn={loggedIn}
                    component={Header}
                />
                <ProtectedRoute
                    exact path="/"
                    onEditAvatar={handleEditAvatarClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditProfile={handleEditProfileClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    loggedIn={loggedIn}
                    component={Main}
                />
                <ProtectedRoute
                    exact path="/"
                    loggedIn={loggedIn}
                    component={Footer}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
