import Navbar from "../components/navbar";
import Menubar from "../components/MenuBar";

import {
  User,
  Mail,
  Calendar,
  Pencil,
  Camera,
  Lock,
  Settings,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState, useEffect } from "react";


type UserProfile = {

  name: string;

  email: string;

  bio: string;

  college: string;

  role: string;

  createdAt: string;

  avatar: string;

};



function Profile() {


  const [isEditing, setIsEditing] = useState(false);



  const [showPassword, setShowPassword] = useState(false);



  const [showNewPassword, setShowNewPassword] =
    useState(false);

    const [profile, setProfile] = useState<UserProfile>({
  name: "",
  email: "",
  bio: "Cloud AI Study Assistant User",
  college: "Computer Engineering",
  role: "Student",
  createdAt: "July 2026",
  avatar: "",
});


useEffect(() => {

  const storedUser = localStorage.getItem("user");

  if(storedUser){

    const user = JSON.parse(storedUser);

    setProfile((prev)=>({
      ...prev,
      name:user.name,
      email:user.email,
      avatar:user.name.charAt(0).toUpperCase()
    }));

  }

}, []);


  



  const [formData, setFormData] = useState({

    name: profile.name,

    email: profile.email,

    bio: profile.bio,

    college: profile.college,

  });





  const [passwordData, setPasswordData] = useState({

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

  });
    return (

    <div className="min-h-screen bg-slate-950 text-white">


      <Navbar />

      <Menubar />



      <main className="p-4 sm:p-6 lg:p-8">



        <div className="
          max-w-5xl
          mx-auto
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          shadow-2xl
          overflow-hidden
        ">



          {/* Profile Header */}


          <div className="
            bg-gradient-to-r
            from-blue-700
            via-blue-600
            to-indigo-700
            p-8
            sm:p-10
            flex
            flex-col
            items-center
          ">



            {/* Avatar */}


            <div className="relative">


              <div className="
                w-28
                h-28
                rounded-full
                bg-white
                text-blue-700
                flex
                items-center
                justify-center
                text-5xl
                font-bold
                shadow-xl
              ">


                {profile.avatar}


              </div>





              {/* Avatar Button */}


              <button

                className="
                  absolute
                  bottom-0
                  right-0
                  bg-blue-600
                  hover:bg-blue-700
                  p-3
                  rounded-full
                  border-4
                  border-blue-600
                  transition
                "

              >


                <Camera size={18}/>


              </button>



            </div>





            <h1 className="
              text-3xl
              font-bold
              mt-5
            ">


              {profile.name}


            </h1>





            <p className="
              text-blue-100
              mt-2
              text-center
            ">


              {profile.bio}


            </p>






            {/* Edit Button */}


            <button

              onClick={() =>
                setIsEditing(!isEditing)
              }

              className="
                mt-6
                bg-white
                text-blue-700
                px-6
                py-3
                rounded-xl
                font-semibold
                flex
                items-center
                gap-2
                hover:bg-blue-50
                transition
              "

            >


              <Pencil size={18}/>


              {isEditing
                ? "Cancel Edit"
                : "Edit Profile"
              }


            </button>




          </div>
          
          {/* Profile Information */}


          <div className="
            p-6
            sm:p-10
            grid
            md:grid-cols-2
            gap-6
          ">



            {/* Full Name */}


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-3">


                <User
                  className="text-blue-400"
                  size={24}
                />


                <h3 className="text-lg font-semibold">
                  Full Name
                </h3>


              </div>



              <p className="text-slate-300">

                {profile.name}

              </p>


            </div>






            {/* Email */}


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-3">


                <Mail
                  className="text-green-400"
                  size={24}
                />


                <h3 className="text-lg font-semibold">
                  Email Address
                </h3>


              </div>



              <p className="text-slate-300">

                {profile.email}

              </p>


            </div>






            {/* Account Created */}


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-3">


                <Calendar
                  className="text-yellow-400"
                  size={24}
                />


                <h3 className="text-lg font-semibold">
                  Account Created
                </h3>


              </div>



              <p className="text-slate-300">

                {profile.createdAt}

              </p>


            </div>






            {/* Role */}


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-3">


                <Settings
                  className="text-purple-400"
                  size={24}
                />


                <h3 className="text-lg font-semibold">
                  Role
                </h3>


              </div>



              <p className="text-slate-300">

                {profile.role}

              </p>


            </div>


          </div>
          
          {isEditing && (

            <div className="
              px-6
              sm:px-10
              pb-10
            ">


              <div className="
                bg-slate-800
                rounded-2xl
                p-6
                border
                border-slate-700
              ">


                <h2 className="
                  text-2xl
                  font-semibold
                  mb-6
                ">

                  Edit Profile

                </h2>




                <div className="space-y-4">


                  <input

                    type="text"

                    value={formData.name}

                    onChange={(e)=>
                      setFormData({
                        ...formData,
                        name:e.target.value
                      })
                    }

                    className="
                      w-full
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                    "

                    placeholder="Full Name"

                  />





                  <input

                    type="email"

                    value={formData.email}

                    onChange={(e)=>
                      setFormData({
                        ...formData,
                        email:e.target.value
                      })
                    }

                    className="
                      w-full
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                    "

                    placeholder="Email"

                  />





                  <textarea

                    value={formData.bio}

                    onChange={(e)=>
                      setFormData({
                        ...formData,
                        bio:e.target.value
                      })
                    }

                    className="
                      w-full
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                    "

                    placeholder="Bio"

                  />


                </div>


              </div>


            </div>

          )}
          
          {/* Change Password */}


          <div className="
            px-6
            sm:px-10
            pb-10
          ">


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-6">


                <Lock
                  className="text-red-400"
                  size={26}
                />


                <h2 className="
                  text-2xl
                  font-semibold
                ">

                  Change Password

                </h2>


              </div>





              <div className="space-y-4">



                {/* Current Password */}


                <div className="relative">


                  <input

                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }

                    value={
                      passwordData.currentPassword
                    }

                    onChange={(e)=>
                      setPasswordData({
                        ...passwordData,
                        currentPassword:
                          e.target.value
                      })
                    }

                    placeholder="Current Password"

                    className="
                      w-full
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-xl
                      px-4
                      py-3
                      pr-12
                      outline-none
                    "

                  />



                  <button

                    onClick={() =>
                      setShowPassword(!showPassword)
                    }

                    className="
                      absolute
                      right-4
                      top-3
                      text-slate-400
                    "

                  >

                    {
                      showPassword
                      ? <EyeOff size={20}/>
                      : <Eye size={20}/>
                    }


                  </button>


                </div>







                {/* New Password */}


                <div className="relative">


                  <input

                    type={
                      showNewPassword
                      ? "text"
                      : "password"
                    }


                    value={
                      passwordData.newPassword
                    }


                    onChange={(e)=>
                      setPasswordData({
                        ...passwordData,
                        newPassword:
                          e.target.value
                      })
                    }


                    placeholder="New Password"


                    className="
                      w-full
                      bg-slate-900
                      border
                      border-slate-700
                      rounded-xl
                      px-4
                      py-3
                      pr-12
                      outline-none
                    "

                  />



                  <button

                    onClick={() =>
                      setShowNewPassword(
                        !showNewPassword
                      )
                    }


                    className="
                      absolute
                      right-4
                      top-3
                      text-slate-400
                    "

                  >


                    {
                      showNewPassword
                      ? <EyeOff size={20}/>
                      : <Eye size={20}/>
                    }


                  </button>


                </div>





                <input

                  type="password"

                  value={
                    passwordData.confirmPassword
                  }


                  onChange={(e)=>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword:
                        e.target.value
                    })
                  }


                  placeholder="Confirm Password"


                  className="
                    w-full
                    bg-slate-900
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                  "

                />




                <button

                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "

                >

                  Update Password


                </button>



              </div>


            </div>


          </div>






          {/* Settings Section */}


          <div className="
            px-6
            sm:px-10
            pb-10
          ">


            <div className="
              bg-slate-800
              rounded-2xl
              p-6
              border
              border-slate-700
            ">


              <div className="flex items-center gap-3 mb-5">


                <Settings
                  className="text-purple-400"
                  size={26}
                />


                <h2 className="text-2xl font-semibold">

                  Settings

                </h2>


              </div>




              <div className="space-y-4">



                <div className="
                  flex
                  justify-between
                  items-center
                  bg-slate-900
                  p-4
                  rounded-xl
                ">


                  <span>
                    Email Notifications
                  </span>



                  <input
                    type="checkbox"
                    className="w-5 h-5"
                  />


                </div>





                <div className="
                  flex
                  justify-between
                  items-center
                  bg-slate-900
                  p-4
                  rounded-xl
                ">


                  <span>
                    AI Learning Recommendations
                  </span>



                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    defaultChecked
                  />


                </div>



              </div>


            </div>


          </div>
          
          {/* Save Profile Button */}


          {isEditing && (

            <div className="
              px-6
              sm:px-10
              pb-10
            ">


              <button

                onClick={() => {

                  setProfile({
                    ...profile,
                    name: formData.name,
                    email: formData.email,
                    bio: formData.bio,
                    college: formData.college,
                  });


                  setIsEditing(false);

                }}


                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  py-4
                  rounded-2xl
                  text-lg
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-3
                  transition
                "

              >

                <Save size={20}/>

                Save Profile


              </button>


            </div>

          )}




        </div>


      </main>


    </div>

  );

}


export default Profile;