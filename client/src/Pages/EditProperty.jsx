import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "../components/Card/propertyCard";
import { SERVER_URL } from "../Config";
import { propertyValidate } from "../Middleware/propertyValidation";
import { toastError, toastSuccess } from "../components/Toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MiniNav from "../components/MiniNav/MiniNav";
import { useParams } from "react-router-dom";

export default function Edit() {

    useEffect(() => {
        document.title = "Edit Your Property | Property Edit | GharBikri";
    })

    const { id } = useParams();

    // console.log(id);

    const [file, setFile] = useState({
        preview: "",
        data: ""
    });

    const [properties, setProperties] = useState({
        p_name: "",
        p_address_street_num: "",
        p_address_street_name: "",
        p_address_city: "",
        p_address_state: "",
        p_description: "",
        p_type: "",
        p_bed: "",
        p_bath: "",
        p_area_sq_ft: "",
        p_repair_quality: "",
        p_year: "",
        p_price: "",
        p_listingType: "",
        p_availability_status: "",
        p_frontal_image: "",
        created_at: "",
        updated_at: ""
    });

    const fetchProperty = async () => {
        const result = await axios.get(`${SERVER_URL}/api/dashboard/property/${id}`, {
            headers: { token: localStorage.token }
        });
        setProperties(result.data);
        console.log(result.data);
    };

    useEffect(() => {
        fetchProperty();
    }, []);

    // destructuring properties
    const {
        p_name,
        p_address_street_num,
        p_address_street_name,
        p_address_city,
        p_address_state,
        p_description,
        p_type,
        p_bed,
        p_bath,
        p_area_sq_ft,
        p_repair_quality,
        p_year,
        p_price,
        p_listingType,
        p_availability_status,
        p_frontal_image,
        created_at,
        updated_at
    } = properties;

    const onChange = (e) => {
        setProperties({
            ...properties,
            [e.target.name]: e.target.value
        });
    };

    const [error, setError] = useState({
        p_name: "",
        p_address_street_num: "",
        p_address_street_name: "",
        p_address_city: "",
        p_address_state: "",
        p_description: "",
        p_type: "",
        p_bed: "",
        p_bath: "",
        p_area_sq_ft: "",
        p_repair_quality: "",
        p_year: "",
        p_price: "",
        p_listingType: "",
        p_availability_status: "",
        p_frontal_image: ""
    });

    const uploadFile = async () => {
        let formData = new FormData();
        formData.append("file", file.data);
        const response = await fetch(`${SERVER_URL}/api/properties/uploadImage`, {
            method: "POST",
            body: formData,
        });
        console.log(response);
    };

    const handlefileChange = (e) => {
        const file = e.target.files[0];
        const name = file.name;

        setProperties({
            ...properties,
            p_frontal_image: name
        });

        if (!file) {
            toastError("File not found");
        }

        setFile({
            preview: URL.createObjectURL(file),
            data: file
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const errors = propertyValidate(properties);

        setError(
            {
                p_name: errors.p_name,
                p_address_street_num: errors.p_address_street_num,
                p_address_street_name: errors.p_address_street_name,
                p_address_city: errors.p_address_city,
                p_address_state: errors.p_address_state,
                p_description: errors.p_description,
                p_type: errors.p_type,
                p_bed: errors.p_bed,
                p_bath: errors.p_bath,
                p_area_sq_ft: errors.p_area_sq_ft,
                p_repair_quality: errors.p_repair_quality,
                p_year: errors.p_year,
                p_price: errors.p_price,
                p_listingType: errors.p_listingType,
                p_frontal_image: errors.p_frontal_image
            }
        );

        // console.log(Object.keys(error).length);

        if (Object.keys(errors).length === 0) {
            try {
                const body = {
                    p_name,
                    p_address_street_num,
                    p_address_street_name,
                    p_address_city,
                    p_address_state,
                    p_description,
                    p_type,
                    p_bed,
                    p_bath,
                    p_area_sq_ft,
                    p_repair_quality,
                    p_year,
                    p_price,
                    p_listingType,
                    p_availability_status,
                    p_frontal_image
                };
                const response = await axios.put(`${SERVER_URL}/api/dashboard/property/${id}`, body, {
                    headers: { token: localStorage.token }
                });

                uploadFile();
                const parseRes = response.data;
                // console.log(parseRes);


                if (parseRes) {
                    toastSuccess("Property updated successfully");
                    setProperties({
                        p_name: "",
                        p_address_street_num: "",
                        p_address_street_name: "",
                        p_address_city: "",
                        p_address_state: "",
                        p_description: "",
                        p_type: "",
                        p_bed: "",
                        p_bath: "",
                        p_area_sq_ft: "",
                        p_repair_quality: "",
                        p_year: "",
                        p_price: "",
                        p_listingType: "",
                        p_availability_status: "",
                        p_frontal_image: ""
                    });
                    // wait for 2 seconds and then redirect to dashboard
                    setTimeout(() => {
                        window.location = "/dashboard";
                    }, 2000);
                }
                else {
                    toastError("Property not updated");
                }

            } catch (err) {
                if (err.response.status === 422) {
                    const errors = err.response.data.errors;
                    const errorMessage = errors.map((error) => error.msg).join(" & ");
                    // console.log(errorMessage)
                    toastError(errorMessage);
                }
            }
        }
        else {
            // if all fields are empty, display error message
            const errorMessages = Object.values(errors).filter(error => error !== null && error !== undefined);
            errorMessages.forEach(error => toastError(error));
        }
    }

    const propertyNew = {
        p_name: p_name,
        p_address_street_num: p_address_street_num,
        p_address_street_name: p_address_street_name,
        p_address_city: p_address_city,
        p_address_state: p_address_state,
        p_bed: p_bed,
        p_bath: p_bath,
        p_area_sq_ft: p_area_sq_ft,
        p_price: p_price,
        p_listingtype: p_listingType,
        p_frontal_image: file.preview
    };

    return (
        <>
            <div className="max-w-[1280px] mx-auto lg:p-6 w-[90%]">
                <MiniNav />
                <h1 className="text-3xl font-semibold text-center lg:text-left my-8 lg:text-5xl">Edit your property</h1>
                <main className="w-full flex lg:mt-10">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full p-6 max-w-full space-y-8 bg-white text-gray-600 sm:p-0">
                            <div className="flex flex-row justify-between">
                                <form>
                                    <div>
                                        {/* form starts */}
                                        <div className="lg:mt-5 space-y-2 mb-5">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white">
                                                    <i className="mdi mdi-home-outline text-lg"></i>
                                                </div>
                                                <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Property Details</h3>
                                            </div>
                                            <p className="text-gray-400 font-normal">
                                                Please start your listing by providing the following information.
                                            </p>
                                        </div>

                                        <div
                                            className="space-y-5 border rounded-lg p-5"
                                        >

                                            {/* first section */}
                                            <div className="flex flex-col lg:flex-row justify-between gap-y-5">

                                                {/* Property Name */}
                                                <div>
                                                    <label className="font-medium">
                                                        Property Name
                                                    </label>
                                                    <div>
                                                        <input
                                                            name="p_name"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={properties.p_name}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_name
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_name}
                                                            </p>
                                                        )}
                                                </div>

                                                {/* Property Type */}
                                                <div>
                                                    <label className="font-medium">
                                                        Property Type
                                                    </label>
                                                    <div className="flex">
                                                        <select
                                                            name="p_type"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_type}
                                                            onChange={(e) => onChange(e)}
                                                        >
                                                            <option value="House">House</option>
                                                            <option value="Apartment">Apartment</option>
                                                            <option value="Villa">Villa</option>
                                                            <option value="Office">Office</option>
                                                        </select>
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_type
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_type}
                                                            </p>
                                                        )}
                                                </div>

                                                {/* Listing Type */}
                                                <div>
                                                    <label className="font-medium">
                                                        Listing Type
                                                    </label>
                                                    <div className="flex">
                                                        <select
                                                            name="p_listingType"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_listingType}
                                                            onChange={(e) => onChange(e)}
                                                        >
                                                            <option value="Rent">Rent</option>
                                                            <option value="Buy">Buy</option>
                                                        </select>
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_listingType
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_listingType}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            {/* Property Desription */}
                                            <div>
                                                <label className="font-medium">
                                                    Description
                                                </label>
                                                <div className="flex">
                                                    <textarea
                                                        name="p_description"
                                                        rows={6}
                                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                        value={p_description}
                                                        onChange={(e) => onChange(e)}
                                                    />
                                                </div>
                                                {/* text that shows up when validation error */}
                                                {error.p_description
                                                    && (
                                                        <p className="text-red-500 text-xs italic">
                                                            {error.p_description}
                                                        </p>
                                                    )}
                                            </div>

                                            {/* Property Address */}
                                            <div className="flex flex-col lg:flex-row justify-between gap-y-5">
                                                {/* Street Number */}
                                                <div>
                                                    <label className="font-medium">
                                                        Street Number
                                                    </label>
                                                    <div className="flex">
                                                        <input
                                                            name="p_address_street_num"
                                                            type="number"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_address_street_num}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_address_street_num
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_address_street_num}
                                                            </p>
                                                        )}
                                                </div>

                                                {/* Street Name */}
                                                <div>
                                                    <label className="font-medium">
                                                        Street Name
                                                    </label>
                                                    <div className="flex">
                                                        <input
                                                            name="p_address_street_name"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_address_street_name}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_address_street_name
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_address_street_name}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            {/* City and State */}
                                            <div className="flex flex-col lg:flex-row justify-between gap-y-5">
                                                {/* Property City */}
                                                <div>
                                                    <label className="font-medium">
                                                        City
                                                    </label>
                                                    <div className="flex">
                                                        <input
                                                            name="p_address_city"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_address_city}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_address_city
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_address_city}
                                                            </p>
                                                        )}
                                                </div>

                                                {/* Property State */}
                                                <div>
                                                    <label className="font-medium">
                                                        State
                                                    </label>
                                                    <div className="flex">
                                                        <input
                                                            name="p_address_state"
                                                            type="text"
                                                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                            value={p_address_state}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    {/* text that shows up when validation error */}
                                                    {error.p_address_state
                                                        && (
                                                            <p className="text-red-500 text-xs italic">
                                                                {error.p_address_state}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </div>


                                        {/* second form */}
                                        <>
                                            <div className="mt-12 space-y-2 mb-5">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white">
                                                        <i className="mdi mdi-home-outline text-xl"></i>
                                                    </div>
                                                    <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Additional Property Details</h3>
                                                </div>
                                                <p className="text-gray-400 font-normal">
                                                    Please provide additional details about your property.
                                                </p>
                                            </div>

                                            {/* form starts */}
                                            <div
                                                className="space-y-5 border rounded-lg p-5"
                                            >

                                                {/* first section */}
                                                <div className="flex flex-col lg:flex-row justify-between gap-y-5 gap-x-10">

                                                    {/* Property Beds */}
                                                    <div>
                                                        <label className="font-medium">
                                                            Beds
                                                        </label>
                                                        <div>
                                                            <input
                                                                name="p_bed"
                                                                type="number"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_bed}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_bed
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_bed}
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Property Bathrooms */}
                                                    <div>
                                                        <label className="font-medium">
                                                            Baths
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                name="p_bath"
                                                                type="number"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_bath}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_bath
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_bath}
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Property Area */}
                                                    <div>
                                                        <label className="font-medium">
                                                            Area
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                name="p_area_sq_ft"
                                                                type="number"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_area_sq_ft}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_area_sq_ft
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_area_sq_ft}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* second section */}
                                                <div className="flex flex-col lg:flex-row justify-between gap-y-5 gap-x-5">

                                                    {/* Property Repair Quality */}
                                                    <div className="lg:w-56">
                                                        <label className="font-medium">
                                                            Repair Quality
                                                        </label>
                                                        <div className="flex">
                                                            <select
                                                                name="p_repair_quality"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_repair_quality}
                                                                onChange={(e) => onChange(e)}
                                                            >
                                                                <option value="Poor">Poor</option>
                                                                <option value="Fair">Fair</option>
                                                                <option value="Average">Average</option>
                                                                <option value="Good">Good</option>
                                                                <option value="Excellent">Excellent</option>
                                                            </select>
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_repair_quality
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_repair_quality}
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Property Year */}
                                                    <div className="">
                                                        <label className="font-medium">
                                                            Year Built
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                name="p_year"
                                                                type="number"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_year}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_year
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_year}
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Property Price */}
                                                    <div>
                                                        <label className="font-medium">
                                                            Price
                                                        </label>
                                                        <div className="flex">
                                                            <input
                                                                name="p_price"
                                                                type="number"
                                                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-cyan-600 shadow-sm rounded-lg border-2 border-gray-200"
                                                                value={p_price}
                                                                onChange={(e) => onChange(e)}
                                                            />
                                                        </div>
                                                        {/* text that shows up when validation error */}
                                                        {error.p_price
                                                            && (
                                                                <p className="text-red-500 text-xs italic">
                                                                    {error.p_price}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>


                                        {/* third form */}
                                        <>
                                            <div className="mt-12 space-y-2 mb-5">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white">
                                                        <i className="mdi mdi-home-outline text-xl"></i>
                                                    </div>
                                                    <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Upload Images</h3>
                                                </div>
                                                <p className="text-gray-400 font-normal">
                                                    Please upload images of your property.
                                                </p>
                                            </div>

                                            {/* image form starts */}
                                            <div
                                                className="space-y-5 border rounded-lg p-5"
                                            >
                                                {/* Frontal View */}
                                                <div className="flex flex-col w-full">
                                                    <div className="flex flex-col w-full">
                                                        <label className="text-gray-600 font-semibold">Frontal View</label>
                                                    </div>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="p_frontal_image"
                                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
                                                        >

                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    aria-hidden="true"
                                                                    className="w-10 h-10 mb-3 text-gray-400"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                {file.preview ? (
                                                                    <>
                                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                            <span className="font-semibold">Image added</span>
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            SVG, PNG, JPG or GIF
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <input
                                                                id="p_frontal_image"
                                                                name="p_frontal_image"
                                                                type="file"
                                                                className="hidden"
                                                                onChange={(e) => handlefileChange(e)}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </div>
                                    <button
                                        className="rounded-3xl px-4 py-2 mt-5 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-cyan-600 hover:bg-cyan-700 border"
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Submit
                                    </button>
                                    <ToastContainer />
                                </form>

                                <div className="hidden lg:block">
                                    <div className="flex-col flex flex-wrap my-0 justify-center">
                                        <h2 className="mt-5 text-4xl mx-auto font-bold  text-gray-900 mb-5">
                                            Preview
                                        </h2>
                                        <div className="flex flex-wrap justify-center">
                                            <PropertyCard property={propertyNew} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
