import { useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import React from "react";

enum Sex {
  Man = 'man',
  Woman = 'woman'
}

interface FormData {
  phone: number;
  email: string;
  nickname: string;
  name: string;
  sername: string;
  sex: Sex;
  advatages: string[];
  checkboxGroup: number[];
  radioGroup: number;
  about: string;
}

export default function App() {
  const [step, setStep] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownText, setDropdownText] = useState<string>("Не выбрано");
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();
  const [advatages, setAdvatages] = useState<number[]>([1, 2, 3]);
  const [charCount, setCharCount] = useState<number>(0);
  const navigate = useNavigate();
  const popup = useRef<null | HTMLDivElement>(null);

  const onSubmit = (data: FormData) => {
    if (step === 0) {
      navigate("/form/steps");
    }

    if (step === 3 && data.checkboxGroup && data.radioGroup) {
      data.checkboxGroup = data.checkboxGroup.map((isChecked, index) =>
        isChecked ? index + 1 : null
      ).filter((value) => value !== null) as number[];
      data.radioGroup = Number(data.radioGroup);
      setTimeout(() => {
        fetchAPI(data);
      }, 1000);
      return;
    }
    setStep(prev => prev + 1);

    console.log(data);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.replace(/\s/g, ""); // Remove spaces
    setCharCount(text.length);
  };

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = `+7 (${numericValue.slice(1, 4)}) ${numericValue.slice(4, 7)}-${numericValue.slice(7, 9)}-${numericValue.slice(9, 11)}`;
    return formattedValue;
  };

  const mockResponse = new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const fetchAPI = async (data: FormData) => {
    return Promise.resolve(mockResponse)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(datares => {
        // обработка данных
        console.log(data, datares);
        if (popup.current) {
          popup.current.classList.add("active");
        }
      })
      .catch(error => {
        // обработка ошибок
        console.error('There has been a problem with your fetch operation:', error);
      });
  };

  return (
    <>
      <Routes>
        <Route path="/form/" element={
          step === 0 &&
          <section className="prof">
            <div className="container">
              <div className="prof__inner">
                <>
                  <div className="prof__user">
                    <div className="prof__avatar">
                      ТВ
                    </div>
                    <div className="prof__info">
                      <span className="prof__name">Терсенев Владислав</span>
                      <ul className="prof__list">
                        <li className="prof__item">
                          <Link className="prof__link" to="https://t.me/EroyEroy" target="_blank" rel="noopener noreferrer">
                            <img className="prof__img" src={`${import.meta.env.BASE_URL}images/icons/Folder.svg`} alt="folder" />
                            Telegram
                          </Link>
                        </li>
                        <li className="prof__item">
                          <Link className="prof__link" to="https://github.com/EroyEroy" target="_blank" rel="noopener noreferrer">
                            <img className="prof__img" src={`${import.meta.env.BASE_URL}images/icons/Folder.svg`} alt="folder" />
                            GitHub
                          </Link>
                        </li>
                        <li className="prof__item">
                          <Link className="prof__link" to="https://togliatti.hh.ru/resume/a43aa96eff09ae1fd10039ed1f61625076526a" target="_blank" rel="noopener noreferrer">
                            <img className="prof__img" src={`${import.meta.env.BASE_URL}images/icons/Folder.svg`} alt="folder" />
                            Резюме
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <form method="POST" onSubmit={handleSubmit(onSubmit)}>
                    <label className="mainLabel">
                      <span className="mainLabel__text">Номер телефона</span>
                      <input
                        className="mainLabel__input disabled"
                        type="text"
                        placeholder="+7 (900) 000-00-00"
                        {...register("phone", {
                          required: "Поле обязательно к заполнению",
                          pattern: {
                            value: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
                            message: "Неверный формат номера телефона",
                          },
                        })}
                        onChange={(e) => {
                          const { value } = e.target;
                          e.target.value = formatPhoneNumber(value);
                        }}
                      />
                      {errors?.phone &&
                        <span
                          className="tip"
                        >
                          {errors?.phone?.message || "Поле заполнено некорректно"}
                        </span>
                      }
                    </label>
                    <label className="mainLabel">
                      <span className="mainLabel__text">Email</span>
                      <input
                        className="mainLabel__input disabled"
                        type="email"
                        placeholder="vladislavtersenev7@gmail.com"
                        {...register("email", {
                          required: "Поле обязательно к заполнению",
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                            message: "Неверный формат электронной почты",
                          },
                        })}
                      />
                      {errors?.email &&
                        <span
                          className="tip"
                        >
                          {errors?.email?.message || "Поле заполнено некорректно"}
                        </span>
                      }
                    </label>
                    <button
                      className="prof__button--mt button"
                      id="button-start"
                      type="submit"
                    >Начать</button>
                  </form>
                </>
              </div>
            </div>
          </section>
        } />
        <Route path="/form/steps" element={
          step !== 0 ?
            <section className="prof">
              <div className="container">
                <div className="prof__inner">
                  <>
                    <div className="steps">
                      {[1, 2, 3].map((el, i) =>
                        <div className={`steps__item${step === i + 1 ? " active" : ""}${i + 1 < step ? " complete" : ""}`} key={i}>
                          <div className="steps__step">
                            <div className="dot"></div>
                          </div>
                          <div className="steps__text">{el}</div>
                        </div>
                      )}
                      <div className="progress-bar" style={{ width: `${((step - 1) / (3 - 1)) * 100}%` }} >
                        <div className="indicator"></div>
                      </div>
                    </div>
                    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
                      <div style={step === 1 ? { display: "" } : { display: "none" }}>
                        <label className="mainLabel">
                          <span className="mainLabel__text">Никнейм</span>
                          <input
                            className="mainLabel__input"
                            type="text"
                            id="field-nickname"
                            placeholder="Placeholder"
                            {...register("nickname", {
                              required: "Поле обязательно к заполнению",
                              maxLength: {
                                value: 30,
                                message: "Максимальная длина 30 символов"
                              },
                              pattern: /^[a-zA-Zа-яА-Я0-9]+$/,
                            })}
                          />
                          {errors?.nickname &&
                            <span
                              className="tip"
                            >
                              {errors?.nickname?.message || "Поле заполнено некорректно"}
                            </span>
                          }
                        </label>
                        <label className="mainLabel">
                          <span className="mainLabel__text">Имя</span>
                          <input
                            className="mainLabel__input"
                            type="text"
                            id="field-name"
                            placeholder="Placeholder"
                            {...register("name", {
                              required: "Поле обязательно к заполнению",
                              maxLength: {
                                value: 50,
                                message: "Максимальная длина 50 символов"
                              },
                              pattern: /^[a-zA-Zа-яА-Я]+$/,
                            })}
                          />
                          {errors?.name &&
                            <span
                              className="tip"
                            >
                              {errors?.name?.message || "Поле заполнено некорректно"}
                            </span>
                          }
                        </label>
                        <label className="mainLabel">
                          <span className="mainLabel__text">Фамилия</span>
                          <input
                            className="mainLabel__input"
                            type="text"
                            id="field-sername"
                            placeholder="Placeholder"
                            {...register("sername", {
                              required: "Поле обязательно к заполнению",
                              maxLength: {
                                value: 50,
                                message: "Максимальная длина 50 символов"
                              },
                              pattern: /^[a-zA-Zа-яА-Я]+$/,
                            })}
                          />
                          {errors?.sername &&
                            <span
                              className="tip"
                            >
                              {errors?.sername?.message || "Поле заполнено некорректно"}
                            </span>
                          }
                        </label>
                        <label className="mainLabel">
                          <span className="mainLabel__text">Пол</span>
                          <div className="dropdown">
                            <div className="dropdown__text" id="field-sex" {...register("sex", {
                              required: "Поле обязательно к заполнению",
                            })} onClick={() => setIsOpen(!isOpen)}>
                              {dropdownText}
                            </div>
                            <ul className={`dropdown__content ${isOpen ? " active" : ""}`}>
                              <li
                                className="dropdown__item"
                                id="field-sex-option-man"
                                onClick={() => {
                                  setDropdownText("мужской");
                                  setIsOpen(false);
                                  setValue("sex", Sex.Man);
                                  clearErrors("sex");
                                }}
                              >
                                мужской
                              </li>
                              <li
                                className="dropdown__item"
                                id="field-sex-option-woman"
                                onClick={() => {
                                  setDropdownText("женский");
                                  setIsOpen(false);
                                  setValue("sex", Sex.Woman);
                                  clearErrors("sex");
                                }}
                              >
                                женский
                              </li>
                            </ul>
                            <img
                              className="dropdown__arrow"
                              src={`${import.meta.env.BASE_URL}images/icons/arrowDown.svg`} alt="arrow down"
                              style={isOpen ? { transform: "scaleY(-1) translate3d(0, 50%, 0)" } : {}}
                            />
                          </div>
                          {errors?.sex &&
                            <span
                              className="tip"
                            >
                              {errors?.sex?.message || "Поле заполнено некорректно"}
                            </span>
                          }
                        </label>
                      </div>
                      <div style={step === 2 ? { display: "" } : { display: "none" }}>
                        <div className="mainLabel">
                          <span className="mainLabel__text">Преимущества</span>
                          {advatages.map((_, i) =>
                            <React.Fragment key={i}>
                              <div className="mainLabel__wrapper">
                                <input
                                  className="mainLabel__input"
                                  type="text"
                                  placeholder="Placeholder"
                                  id={`field-advatages-${i + 1}`}
                                  {...(step === 2 && register(`advatages.${i}`, {
                                    required: "Поле обязательно к заполнению",
                                  }))}
                                />
                                <button
                                  className="mainLabel__delete"
                                  type="button"
                                  id={`button-remove-${i + 1}`}
                                  onClick={() => {
                                    if (advatages.filter((_, index) => index !== i).length === 0) { return; }
                                    setAdvatages((prev) => prev.filter((_, index) => index !== i));
                                  }}
                                >
                                  <img
                                    src={`${import.meta.env.BASE_URL}images/icons/trash.svg`}
                                    alt="delete"
                                  />
                                </button>
                              </div>
                              {errors?.advatages?.[i] &&
                                <span
                                  className="tip"
                                >
                                  {errors?.advatages?.[i]?.message || "Поле заполнено некорректно"}
                                </span>
                              }
                            </React.Fragment>
                          )}
                          <button
                            className="button button--outline"
                            type="button"
                            style={{ width: "44px", height: "44px", padding: "12px" }}
                            id="button-add"
                            onClick={() => setAdvatages((prev) => [...prev, advatages.length + 1])}
                          >
                            <img src={`${import.meta.env.BASE_URL}images/icons/plus.svg`} alt="plus" />
                          </button>
                        </div>
                        <div className="mainLabel">
                          <span className="mainLabel__text">Checkbox группа</span>
                          {[1, 2, 3].map((_, i) =>
                            <label className="mainCheckbox" key={i}>
                              <input
                                type="checkbox"
                                {...(step === 2 && register(`checkboxGroup.${i}`))}
                                hidden
                                id={`field-checkbox-group-option-${i + 1}`}
                              />
                              <div className="mainCheckbox__check"></div>
                              <span className="mainCheckbox__text">{i + 1}</span>
                            </label>
                          )}
                        </div>
                        <div className="mainLabel">
                          <span className="mainLabel__text">Radio группа</span>
                          {[1, 2, 3].map((_, i) =>
                            <label className="mainRadio" key={i}>
                              <input
                                type="radio"
                                {...(step === 2 && register(`radioGroup`))}
                                hidden
                                value={i + 1}
                                id={`field-radio-group-option-${i + 1}`}
                              />
                              <div className="mainRadio__check"></div>
                              <span className="mainRadio__text">{i + 1}</span>
                            </label>
                          )}
                        </div>
                      </div>
                      <div style={step === 3 ? { display: "" } : { display: "none" }}>
                        <label className="mainLabel" style={{ width: "100%" }}>
                          <span className="mainLabel__text">О себе</span>
                          <textarea
                            className="mainLabel__input"
                            placeholder="Placeholder"
                            {...(step === 3 && register("about", {
                              maxLength: {
                                value: 200,
                                message: "Максимальная длина 200 символов"
                              },
                              required: "Поле обязательно к заполнению"
                            }))}
                            id="field-about"
                            onChange={handleTextareaChange}
                          />
                          <span style={{ display: "block", textAlign: "right" }}>Символов без пробелов: {charCount}</span>
                          {errors?.about &&
                            <span
                              className="tip"
                            >
                              {errors?.about?.message}
                            </span>
                          }
                        </label>
                      </div>
                      <div className="prof__buttons">
                        <button
                          className="button button--outline"
                          id="button-back"
                          onClick={() => {
                            setStep(prev => prev - 1)
                            if (step - 1 === 0) {
                              navigate("/form/");
                            }
                          }}
                          type="button"
                        >
                          Назад
                        </button>
                        <button
                          className="button"
                          id="button-next"
                          type="submit"
                        >
                          {step === 3 ? "Отправить" : "Далее"}
                        </button>
                      </div>
                    </form>
                  </>
                </div>
              </div>
              <div className="popup" ref={popup}>
                <div className="popup__inner">
                  <h2 className="popup__title">Форма успешно отправлена</h2>
                  <img src={`${import.meta.env.BASE_URL}images/icons/check.svg`} alt="check mark" />
                  <button className="button" onClick={() => {
                    navigate("/form/");
                    setStep(0);
                  }}>На главную</button>
                </div>
              </div>
            </section>
            : <Navigate to="/form/" />
        } />
      </Routes >
    </>
  )
}