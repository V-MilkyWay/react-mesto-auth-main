import React from 'react';
import statusGood from '../images/icon.svg';
import statusErr from '../images/Union.svg';
const status1 = 'Вы успешно зарегистрировались!';
const status2 = 'Что-то пошло не так! Попробуйте ещё раз.';


function InfoTooltip(props) {
    return (
        <>
            <div className={`popup popup_type_infoTooltip popup_opened`} >
                <div className="popup__container">
                    <button onClick={props.onClose} type="button" className="popup__close-button"></button>
                    <div className="form">
                        <img className="form__image" src={statusGood } alt="Изображение" />
                        <h2 className="form__status">{status1}</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoTooltip;