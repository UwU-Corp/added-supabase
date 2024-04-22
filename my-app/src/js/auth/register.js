import { supabase, successNotification, errorNotification } from "../main";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  //!! Disable the submit button
  document.querySelector("#form_register button").disabled = true;
  document.querySelector("#form_register button").innerHTML =
    `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      </div>
                      <span>Loading...</span>`;

  // !! get value from form
  const formData = new FormData(form_register);

  //!! input from the form
  if (formData.get("password") == formData.get("password_confirmation")) {
    //!! create user
    const { data, error } = await supabase.auth.signUp({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    let user_id = data.user.id;

    // !! check user if registered already
    if (user_id != null) {
      const { data, error } = await supabase
        .from("user_info")
        .insert([
          {
            // !! in the db the order is contact_nuum > address > user_id > first and last name
            first_name: formData.get("first_name"),
            last_name: formData.get("last_name"),
            contact_num: formData.get("contact_num"),
            address: formData.get("address"),
            user_id: user_id,
          },
        ])
        .select();

      if (error == null) {
        successNotification("Sign up successful!", 10);
      } else {
        errorNotification("Something went wrong, please try again later.", 10);
        console.log(error);
      }
    }
  } else {
    errorNotification("Password does not match. Please try again.", 10);
  }

  //!! Reset Form
  form_register.reset();

  //!! Enable Submit Button
  document.querySelector("#form_register button").disabled = false;
  document.querySelector("#form_register button").innerHTML = `Sign Up`;
};
