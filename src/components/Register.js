import React from 'react';
import Header from './Header.js';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <>
            <Header children={
                <Link className="header__link" to="/sign-in">
                    Войти
                </Link>
            } />
            <form id="register" name="register" className="form form_type_register" noValidate>
                <h2 className="form__title form__title_type_login">Регистрация</h2>
                <input id="login-input" name="login" type="email" className="form__input form__input_type_login" placeholder="Email" required minLength="2" maxLength="40" />
                <span className="form__input-error login-input-error"></span>
                <input id="password-input" name="password" type="password" className="form__input form__input_type_password" placeholder="Пароль" required minLength="2" maxLength="200" />
                <span className="form__input-error password-input-error"></span>
                <button type="submit" className="form__save-button form__save-button_type_register">Зарегистрироваться</button>
                <Link className="form__link" to="/sign-in">Уже зарегистрировались? Войти</Link>
            </form>
        </>
    );
}

export default Register;