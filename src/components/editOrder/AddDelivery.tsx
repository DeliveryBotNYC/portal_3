import DeliveredIcon from "../../assets/delivered.svg";
import DeliveredBwIcon from "../../assets/delivery-bw.svg";
import DeliveredBwFilledIcon from "../../assets/delivery-bw-filled.svg";
import RefreshIcon from "../../assets/refresh-icon.svg";
import homeIcon from "../../assets/store-bw.svg";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import "https://maps.googleapis.com/maps/api/js?key=AIzaSyAxbAIczxXk3xoL3RH85z3eAZLncLZAuGg&libraries=places";
import clipart from "../../assets/deliveryClipArt.svg";
import {
  enforceFormat,
  formatToPhone,
  isCompleted,
  initialState,
  isEmpty,
} from "../reusable/functions";
import { url, useConfig } from "../../hooks/useConfig";
const AddDelivery = ({ data, stateChanger, ...rest }) => {
  const config = useConfig();
  const [autoFillDropdown, setaAutoFillDropdown] = useState([]);

  //address autofill
  const checkAddressExist = useMutation({
    mutationFn: (newTodo: string) =>
      axios.post(
        url + "/address/autocomplete",
        { address: rest?.state?.delivery.location.street_address_1 },
        config
      ),
    onSuccess: (location) => {
      if (location) setaAutoFillDropdown(location.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //autofill phone or reset when changed
  function phone_input(phone) {
    stateChanger({
      ...rest?.state,
      timeframe: initialState.timeframe,
      delivery: {
        ...initialState.delivery,
        phone: phone,
        items: data?.items,
        required_verification: data?.delivery_proof,
      },
    });
  }

  //address autofill
  function address_input(address: string) {
    for (var i = 0; i < autoFillDropdown.length; i++) {
      if (autoFillDropdown[i].full === address) {
        stateChanger({
          ...rest?.state,
          delivery: {
            ...rest?.state?.delivery,
            location: autoFillDropdown[i],
          },
        });
        return;
      }
    }
    stateChanger({
      ...rest?.state,
      delivery: {
        ...rest?.state?.delivery,
        location: {
          ...initialState.delivery.location,
          street_address_1: address,
        },
      },
    });
    checkAddressExist.mutate(address);
  }

  return (
    <div className="w-full bg-white rounded-2xl my-5">
      {/* Header */}
      <div className="py-5 px-2.5 flex items-center justify-between gap-2.5">
        {/* Left side */}
        <div className="flex items-center gap-2.5">
          <img
            src={
              isCompleted(rest?.state).delivery
                ? DeliveredBwFilledIcon
                : DeliveredBwIcon
            }
            alt="icon"
          />

          <p className="text-2xl text-black font-bold heading">Delivery</p>
        </div>

        {/* Right Side */}
        <div>
          {isEmpty(rest?.state).delivery ? (
            <img
              onClick={() => {
                stateChanger({
                  ...rest.state,
                  delivery: {
                    ...rest.state.delivery,
                    phone: data.phone,
                    name: data.name,
                    note: data.note,
                    location: data.location,
                  },
                });
              }}
              src={homeIcon}
              alt="home-icon"
            />
          ) : (
            <img
              onClick={() => {
                stateChanger({
                  ...rest?.state,
                  timeframe: initialState.timeframe,
                  delivery: {
                    ...initialState.delivery,
                    items: data?.items,
                    required_verification: data?.delivery_proof,
                  },
                });
              }}
              src={RefreshIcon}
              alt="refresh-icon"
            />
          )}
        </div>
      </div>

      {/* delivery Forms Data */}
      {!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
        rest?.state?.delivery?.phone
      ) ? (
        <div className="w-full grid grid-cols-1 gap-2.5 px-5 pb-3">
          <div className="w-full">
            <label className="text-themeDarkGray text-xs">
              Phone <span className="text-themeRed">*</span>
            </label>
            <input
              className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
              id="delivery_phone"
              value={rest?.state?.delivery?.phone}
              onKeyUp={(e) => formatToPhone(e)}
              onKeyDown={(e) => enforceFormat(e)}
              onChange={(e) => phone_input(e.target.value)}
            />
          </div>
          <img src={clipart} alt="delivery-clipart" />
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 gap-2.5 px-5 pb-3">
          {/* Phone */}
          <div className="w-full">
            <label className="text-themeDarkGray text-xs">
              Phone <span className="text-themeRed">*</span>
            </label>

            {/* Input Field */}
            <input
              className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
              id="delivery_phone"
              value={rest?.state?.delivery?.phone}
              onKeyUp={(e) => formatToPhone(e)}
              onKeyDown={(e) => enforceFormat(e)}
              onChange={(e) => {
                if (
                  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
                    e.target.value
                  )
                )
                  stateChanger({
                    ...rest?.state,
                    delivery: {
                      ...rest?.state?.delivery,
                      phone: e.target.value,
                    },
                  });
                else phone_input(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <label className="text-themeDarkGray text-xs">
              Name <span className="text-themeRed">*</span>
            </label>

            {/* Input Field */}
            <input
              type="text"
              id="delivery_name"
              className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
              value={rest?.state?.delivery?.name}
              onChange={(e) =>
                stateChanger({
                  ...rest?.state,
                  delivery: {
                    ...rest?.state?.delivery,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>

          {/* Address */}
          <div className="w-full">
            <label className="text-themeDarkGray text-xs">
              Address <span className="text-themeRed">*</span>
            </label>

            <input
              value={rest?.state?.delivery?.location?.street_address_1}
              type="search"
              className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
              list="delivery_autofill"
              onChange={(e) => address_input(e.target.value)}
            />

            <datalist id="delivery_autofill">
              {autoFillDropdown.map((item, key) => (
                <option key={key} value={item.full} />
              ))}
            </datalist>
          </div>

          {/* Apt, Access code */}
          <div className="w-full flex items-center justify-between gap-2.5">
            {/* Apt */}
            <div className="w-full">
              <label className="text-themeDarkGray text-xs">Apt</label>

              {/* Input Field */}
              <input
                type="number"
                id="delivery_street_address_2"
                className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                value={rest?.state?.delivery?.location?.street_address_2}
                onChange={(e) =>
                  stateChanger({
                    ...rest?.state,
                    delivery: {
                      ...rest?.state?.delivery,
                      location: {
                        ...rest.state?.delivery?.location,
                        street_address_2: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>

            {/* Access code */}
            <div className="w-full">
              <label className="text-themeDarkGray text-xs">Access code</label>

              {/* Input Field */}
              <input
                type="password"
                id="delivery_access_code"
                className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                value={rest?.state?.delivery?.location?.access_code}
                onChange={(e) =>
                  stateChanger({
                    ...rest?.state,
                    delivery: {
                      ...rest?.state?.delivery,
                      location: {
                        ...rest?.state?.delivery?.location,
                        access_code: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Courier Note */}
          <div className="w-full col-span-2">
            <label className="text-themeDarkGray text-xs">Courier note</label>

            {/* Input Field */}
            <input
              type="text"
              id="delivery_note"
              value={rest?.state?.delivery?.note}
              onChange={(e) =>
                stateChanger({
                  ...rest?.state,
                  delivery: {
                    ...rest?.state?.delivery,
                    note: e.target.value,
                  },
                })
              }
              className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
            />
          </div>
          {/* Picture Box */}
          <div>
            <label className="text-themeDarkGray text-xs">
              Proof of delivery
            </label>

            {/* Proofs */}
            <div className="flex items-center gap-2.5">
              {/* Picture */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  id="DeliveryPicture"
                  type="checkbox"
                  className="accent-themeLightOrangeTwo"
                  checked={
                    rest?.state?.delivery?.required_verification?.picture
                  }
                  onChange={(e) =>
                    stateChanger({
                      ...rest?.state,
                      delivery: {
                        ...rest?.state?.delivery,
                        required_verification: {
                          ...rest?.state?.delivery?.required_verification,
                          picture: e.target.checked,
                        },
                      },
                    })
                  }
                />

                <label
                  htmlFor="DeliveryPicture"
                  className="text-black text-sm leading-none pt-[3px] cursor-pointer"
                >
                  Picture
                </label>
              </div>

              {/* Recipient */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  id="recipient"
                  type="checkbox"
                  className="accent-themeLightOrangeTwo"
                  checked={
                    rest?.state?.delivery?.required_verification?.recipient
                  }
                  onChange={(e) =>
                    stateChanger({
                      ...rest?.state,
                      delivery: {
                        ...rest?.state?.delivery,
                        required_verification: {
                          ...rest?.state?.delivery?.required_verification,
                          recipient: e.target.checked,
                        },
                      },
                    })
                  }
                />

                <label
                  htmlFor="recipient"
                  className="text-black text-sm leading-none pt-[3px] cursor-pointer"
                >
                  Recipient
                </label>
              </div>

              {/* Signature */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  id="signature"
                  type="checkbox"
                  className="accent-themeLightOrangeTwo"
                  checked={
                    rest?.state?.delivery?.required_verification?.signature
                  }
                  onChange={(e) =>
                    stateChanger({
                      ...rest?.state,
                      delivery: {
                        ...rest?.state?.delivery,
                        required_verification: {
                          ...rest?.state?.delivery?.required_verification,
                          signature: e.target.checked,
                        },
                      },
                    })
                  }
                />

                <label
                  htmlFor="signature"
                  className="text-black text-sm leading-none pt-[3px] cursor-pointer"
                >
                  Signature
                </label>
              </div>
            </div>
          </div>
          {/* Order Information Boxes */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Tip */}
            <div className="w-full">
              <label className="text-themeDarkGray text-xs">Tip</label>

              {/* Input Field */}
              <input
                type="number"
                step=".01"
                className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                value={rest?.state?.delivery?.tip / 100}
                onChange={(e) =>
                  stateChanger({
                    ...rest?.state,
                    delivery: {
                      ...rest?.state?.delivery,
                      tip: 100 * parseFloat(e.target.value).toFixed(2),
                    },
                  })
                }
              />
            </div>

            {/* Order ID */}
            <div className="w-full">
              <label className="text-themeDarkGray text-xs">
                External order id
              </label>

              {/* Input Field */}
              <input
                type="text"
                className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                value={rest?.state?.delivery?.external_order_id}
                onChange={(e) =>
                  stateChanger({
                    ...rest?.state,
                    delivery: {
                      ...rest?.state?.delivery,
                      external_order_id: e.target.value,
                    },
                  })
                }
              />
            </div>

            {rest?.state?.delivery?.items?.map((item, index2) => (
              <Fragment key={index2}>
                <div className="w-full">
                  <label className="text-themeDarkGray text-xs">
                    Quantity <span className="text-themeRed">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                    value={item.quantity}
                    onChange={(e) =>
                      stateChanger({
                        ...rest?.state,
                        delivery: {
                          ...rest?.state?.delivery,
                          items: [
                            ...rest?.state?.delivery?.items?.slice(0, index2),
                            {
                              quantity: e.target.value,
                              type: item.type,
                            },
                            ...rest?.state?.delivery?.items?.slice(index2 + 1),
                          ],
                        },
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <label className="text-themeDarkGray text-xs">
                    Item type <span className="text-themeRed">*</span>
                  </label>
                  {/* Select Field */}
                  <select
                    className="w-full text-sm text-themeLightBlack placeholder:text-themeLightBlack pb-1 border-b border-b-contentBg outline-none"
                    value={item.type}
                    onChange={(e) =>
                      stateChanger({
                        ...rest?.state,
                        delivery: {
                          ...rest?.state?.delivery,
                          items: [
                            ...rest?.state?.delivery?.items?.slice(0, index2),
                            {
                              quantity: item.quantity,
                              type: e.target.value,
                            },
                            ...rest?.state?.delivery?.items?.slice(index2 + 1),
                          ],
                        },
                      })
                    }
                  >
                    <option value="box">Box</option>
                    <option value="1-hander">Packets</option>
                    <option value="bag">Catoon</option>
                  </select>
                </div>
                {rest?.state?.delivery?.items?.length > 1 ? (
                  <div
                    className="col-span-4 flex items-center justify-end gap-2.5 py-2.5"
                    onClick={() =>
                      stateChanger({
                        ...rest?.state,
                        delivery: {
                          ...rest?.state?.delivery,
                          items: [
                            ...rest?.state?.delivery?.items?.slice(0, index2),
                            ...rest?.state?.delivery?.items?.slice(index2 + 1),
                          ],
                        },
                      })
                    }
                  >
                    <p className="text-xs text-themeDarkGray cursor-pointer">
                      Remove item -
                    </p>
                  </div>
                ) : null}
              </Fragment>
            ))}
            {/* Add barcode or Additional Item */}
            <div
              className="col-span-4 flex items-center justify-end gap-2.5 py-2.5"
              onClick={() =>
                stateChanger({
                  ...rest?.state,
                  delivery: {
                    ...rest?.state?.delivery,
                    items: [
                      ...rest?.state?.delivery?.items?.slice(
                        0,
                        rest?.state?.delivery?.items?.length
                      ),
                      initialState.delivery.items[0],
                    ],
                  },
                })
              }
            >
              <p className="text-xs text-themeDarkGray cursor-pointer">
                Additional item +
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDelivery;