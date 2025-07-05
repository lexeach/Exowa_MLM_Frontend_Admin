// In Reducers/UserReducers.js
import { createSlice } from "@reduxjs/toolkit";

const initialStateObj = {
  activeTab: "",
  token: "",
  adminId: "",
  adminDetails: {},
  allUserData: [],
  userData: {},
  allAdmin: [],
  withdrowHistory: [],
  depositHistory: [],
  supportAdminUsersAssignState: [
    {
      adminId: null,
      users: [
        {
          userId: "",
          username: "",
        },
      ],
    },
  ],
  socialMediaState: {},
  privacyPolicyState: {
    title: "",
    description: "",
  },
  particularAdminState: {},
  loginAdminDetailsState: {},
  // Rajendar-----
  MyPrivacyPolicyData: {},
}

const userSlice = createSlice({
  name: "user",

  initialState: initialStateObj,

  reducers: {
    activeTabData: (state, action) => {
      state.activeTab = action.payload.activeTab;
    },
    tokenData: (state, action) => {
      state.token = action.payload;
    },
    adminId: (state, action) => {
      state.adminId = action.payload;
    },
    adminDetailsData: (state, action) => {
      state.adminDetails = action.payload;
    },
    allUserData: (state, action) => {
      state.allUserData = action.payload;
    },
    insertUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateEmailState: (state, action) => {
      state.userData.user_email = action.payload;
    },
    updatePhoneState: (state, action) => {
      state.userData.mobile_no = action.payload;
    },
    updateUserBlockedState: (state, action) => {
      if (state.userData.userid == action.payload.userid) {
        state.userData.block = action.payload.block;
      }
    },
    updateUserQualifyState: (state, action) => {
      if (state.userData.userid == action.payload.userid) {
        state.userData.is_qualified = action.payload.qualify;
      }
    },
    updatePartnerQualifyState: (state, action) => {
      if (state.userData.userid == action.payload.userid) {
        state.userData.is_top_approved = action.payload.status;
      }
    },
    // ----------admin data
    allAdminData: (state, action) => {
      state.allAdmin = action.payload;
    },
    AdminApprovelStatusChange: (state, action) => {
      const admin = state.allAdmin.find((admin) => admin.admin_id === action.payload.adminId)
      admin.status = action.payload.status
    },
    AdminBlockStatusChange: (state, action) => {
      const admin = state.allAdmin.find((admin) => admin.admin_id === action.payload.adminId)
      admin.block = action.payload.status
    },
    loginAdminDetailsData: (state, action) => {
      state.loginAdminDetailsState = action.payload;
    },
    // --------- withdrow data
    WithdrowHistoryData: (state, action) => {
      state.withdrowHistory = action.payload;
    },
    // ------ withdrow status change
    withdrowHistoryStatusChange: (state, action) => {
      const withdrow = state.withdrowHistory.find((data) => data.transaction_id === action.payload.transaction_id)
      if (withdrow) {
        withdrow.status = action.payload.status
        withdrow.transaction_reference = action.payload.transaction_reference
        withdrow.transaction_mode = action.payload.transaction_mode
      } else {
        console.log("Withdrow history not found");
      }
    },
    // --------- deposit  data
    depositHistoryData: (state, action) => {
      state.depositHistory = action.payload;
    },
    // ------ deposit status change
    depositHistoryStatusChange: (state, action) => {
      const deposit = state.depositHistory.find((data) => data.transaction_id === action.payload.transaction_id)
      if (deposit) {
        deposit.status = action.payload.status
      } else {
        console.log("Deposit History Not Found");
      }
    },
    supportAdminUsersData: (state, action) => {
      const existingAdmin = state.supportAdminUsersAssignState?.find(
        (admin) => admin.adminId === action.payload.adminId
      );

      if (existingAdmin) {
        // Update the existing admin's users
        existingAdmin.users = action.payload.users;
      } else {
        // Add a new admin with users
        state.supportAdminUsersAssignState.push(action.payload);
      }
    },

    socialMediaData: (state, action) => {
      state.socialMediaState = action.payload;
    },
    privacyPolicyData: (state, action) => {
      state.privacyPolicyState = action.payload;
    },
    MyPrivacyPolicyData: (state, action) => {
      state.MyPrivacyPolicyData = action.payload;
    },
    particularAdminData: (state, action) => {
      state.particularAdminState = action.payload;
    },
    emptyEntireRedux: (state, action) => {
      return initialStateObj;
    },
    addAndRemoveTabToAdminData: (state, action) => {

      if (state.particularAdminState && action.payload.status == "0") {
        state.particularAdminState.routes.push(action.payload.page)

      } else if (state.particularAdminState && action.payload.status == "1") {
        state.particularAdminState.routes = state.particularAdminState.routes.filter(route => route !== action.payload.page);
      }
      else {
        console.log("Admin not found with ID:");
      }
    },

  },
});
export const {
  activeTabData,
  tokenData,
  adminId,
  adminDetailsData,
  allUserData,
  insertUserData,
  updateUserBlockedState,
  updateUserQualifyState,
  updatePartnerQualifyState,
  allAdminData,
  updateEmailState,
  updatePhoneState,
  WithdrowHistoryData,
  withdrowHistoryStatusChange,
  depositHistoryData,
  depositHistoryStatusChange,
  AdminApprovelStatusChange,
  AdminBlockStatusChange,
  updateUserDepositStatusState,
  userLoginData,
  supportAdminUsersData,
  socialMediaData,
  privacyPolicyData,
  loginAdminDetailsData,
  MyPrivacyPolicyData,
  particularAdminData,
  emptyEntireRedux,
  addAndRemoveTabToAdminData,
} = userSlice.actions;
export const userLinksReducer = userSlice.reducer;
