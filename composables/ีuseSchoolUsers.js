import { useAuthStore } from "~/stores/auth";
import { useApi } from "~/composables/useApiFire";
export function useSchoolUsers(apiDomain) {
  const { useApiFire } = useApi();
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const userId = route.params.id;
  const schoolId = route.params.id;
  const staffs = ref([]);
  const isLoading = ref(false);
  const showAvatarPopup = ref(false);

  const user = ref(null);
  const selectedAvatar = ref("");
  const schoolName = ref();
  const errorMessage = ref();
  const form = ref({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    school: "",
    status: "Active",
    avatar: "",
  });
  const avatars = [
    "/image-avatars/1.png",
    "/image-avatars/2.png",
    "/image-avatars/3.png",
    "/image-avatars/4.png",
    "/image-avatars/5.png",
    "/image-avatars/6.png",
  ];

  async function fetchSchoolUsers() {
    try {
      const res = await useApiFire("/schoolUsers/getAllUser");
      if (res) {
        staffs.value = res.data || null;
      }
    } catch (err) {
      console.error("❌ Fetch school users failed:", err);
    }
  }

  async function fetchUser() {
    try {
      const res = await useApiFire(`/schoolUsers/getUser/${userId}`);

      if (res) {
        user.value = res.data || null;
      }
    } catch (err) {
      console.error(err);
      errorMessage.value = err.message;
    } finally {
    }
  }

  async function fetchUserById() {
    try {
      const res = await useApiFire(`/schoolUsers/getUser/${userId}`);
      if (res) {
        const user = res.data;
        form.value = {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phone_number || "",
          role: user.role,
          school: user.schoolName,
          status: user.status || "Active",
          avatar: user.avatar || avatars[0],
        };
        selectedAvatar.value = form.value.avatar;
      } else {
        alert("❌ User not found");
        router.push("/schools");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("🔥 Failed to load user data");
      router.push("/schools");
    } finally {
      isLoading.value = false;
    }
  }

  async function getSchool() {
    try {
      const res = await useApiFire(`/schools/get/${schoolId}`);
      if (res) schoolName.value = json.data.schoolName;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    try {
      const res = await useApiFire(
        `/schoolUsers/updateSchoolUser/${form.value.id}`,
        {
          method: "PUT",
          body: {
            name: form.value.name,
            email: form.value.email,
            phone_number: form.value.phoneNumber,
            role: form.value.role,
            school: form.value.schoolName,
            status: form.value.status,
            avatar: form.value.avatar,
          },
        }
      );

      if (res) {
        alert("✅ Updated successfully!");
        router.push(`/users/detail/${userId}`);
      } else {
        alert("❌ Failed to update user");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("🔥 Update failed");
    }
  }

  function confirmAvatar() {
    if (!selectedAvatar.value) return;
    form.value.avatar = selectedAvatar.value;
    showAvatarPopup.value = false;
  }

  return {
    showAvatarPopup,
    errorMessage,
    schoolName,
    form,
    schoolId,
    user,
    staffs,
    isLoading,
    selectedAvatar,
    fetchSchoolUsers,
    fetchUser,
    fetchUserById,
    getSchool,
    handleSave,
    confirmAvatar,
  };
}
