import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";

const AddDoctor = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocImg(file);
    toast.success("Image uploaded successfully");
  };

  const resetForm = () => {
    setDocImg(false);
    setName("");
    setEmail("");
    setPassword("");
    setExperience("1 Year");
    setFees("");
    setAbout("");
    setSpeciality("General physician");
    setDegree("");
    setAddress1("");
    setAddress2("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!docImg) return toast.error("Image Not Selected");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <p className="text-xl font-medium text-gray-800 mb-5 pb-4 border-b border-gray-200">
        Add Doctor
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white border border-gray-200 rounded-xl p-5 sm:p-7 lg:p-8"
      >
        {/* Upload Image */}
        <label htmlFor="doc-img" className="block cursor-pointer">
          <div className="flex flex-col sm:flex-row items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-7 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 transition-colors">
            {docImg ? (
              <img
                src={URL.createObjectURL(docImg)}
                alt="Doctor preview"
                className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <img
                  src={assets.upload_area}
                  alt=""
                  className="w-7 h-7 object-contain opacity-50"
                />
              </div>
            )}
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-gray-700">
                {docImg ? "Change photo" : "Upload doctor photo"}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG PNG WebP</p>
            </div>
          </div>
        </label>
        <input
          type="file"
          id="doc-img"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

        {/* Personal Details */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-7 mb-4 pt-5 border-t border-gray-100">
          Personal details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-name"
            >
              Full name
            </label>
            <input
              type="text"
              id="doc-name"
              placeholder="Doctor Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-email"
            >
              Email address
            </label>
            <input
              type="email"
              id="doc-email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-pass"
            >
              Password
            </label>
            <input
              type="password"
              id="doc-pass"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-edu"
            >
              Education
            </label>
            <input
              type="text"
              id="doc-edu"
              placeholder="Education"
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
            />
          </div>
        </div>

        {/* Professional Info */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-7 mb-4 pt-5 border-t border-gray-100">
          Professional info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-spec"
            >
              Speciality
            </label>
            <select
              id="doc-spec"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full appearance-none cursor-pointer"
            >
              <option value="General physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-exp"
            >
              Experience
            </label>
            <select
              id="doc-exp"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full appearance-none cursor-pointer"
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={`${i + 1} Year`}>
                  {i + 1} Year
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-fees"
            >
              Consultation fees (₹)
            </label>
            <input
              type="number"
              id="doc-fees"
              placeholder="Fees"
              required
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium text-gray-500">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Address 1"
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
              />
              <input
                type="text"
                placeholder="Address 2"
                required
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label
              className="text-sm font-medium text-gray-500"
              htmlFor="doc-about"
            >
              About
            </label>
            <textarea
              id="doc-about"
              placeholder="About doctor"
              required
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition w-full resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all px-6 py-2.5 rounded-lg w-full sm:w-auto"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Adding doctor..." : "Add doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
