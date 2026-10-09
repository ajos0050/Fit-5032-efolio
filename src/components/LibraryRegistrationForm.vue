<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">

        <h2 class="text-center mb-4">User Information Form</h2>

        <form @submit.prevent="submitForm">

          <!-- Username & Password -->
          <div class="row mb-3">
            <div class="col-12 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="row mb-3">
            <div class="col-12 col-sm-6 offset-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                @input="() => validateConfirmPassword(false)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <!-- Australian Resident & Gender -->
          <div class="row mb-3">
            <div class="col-12 col-sm-6">
              <div class="form-check mt-4">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>

        <!-- Submitted Cards -->
        <div class="row mt-5" v-if="submittedCards.length">
          <div class="d-flex flex-wrap justify-content-start">
            <div
              v-for="(card, index) in submittedCards"
              :key="index"
              class="card m-2"
              style="width: 18rem;"
            >
              <div class="card-header">User Information</div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Username:</strong> {{ card.username }}</li>
                <li class="list-group-item"><strong>Password:</strong> {{ card.password }}</li>
                <li class="list-group-item">
                  <strong>Australian Resident:</strong> {{ card.isAustralian ? "Yes" : "No" }}
                </li>
                <li class="list-group-item"><strong>Gender:</strong> {{ card.gender }}</li>
                <li class="list-group-item"><strong>Reason:</strong> {{ card.reason }}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emptyForm = () => ({
  username: "",
  password: "",
  confirmPassword: "",
  isAustralian: false,
  reason: "",
  gender: ""
});

const formData = ref(emptyForm());
const submittedCards = ref([]);

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null
});

// blur = true shows the error; typing (blur = false) only clears it once fixed
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters.";
  } else {
    errors.value.username = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!/[A-Z]/.test(password)) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(password)) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!/\d/.test(password)) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }

  // If they change the password after confirming, re-check the match
  if (formData.value.confirmPassword) validateConfirmPassword(blur);
};

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = "Passwords do not match.";
  } else {
    errors.value.confirmPassword = null;
  }
};

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateConfirmPassword(true);

  const hasErrors = Object.values(errors.value).some((e) => e);
  if (hasErrors) return;

  // Don't store the confirm field in the card
  const { confirmPassword, ...card } = formData.value;
  submittedCards.value.push(card);
  clearForm();
};

const clearForm = () => {
  formData.value = emptyForm();
  errors.value = { username: null, password: null, confirmPassword: null };
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>