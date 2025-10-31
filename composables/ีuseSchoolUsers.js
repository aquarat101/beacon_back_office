import { useAuthStore } from "~/stores/auth";

export function useSchoolUsers(apiDomain) {
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const userId = route.params.id;
  const schoolId = route.query.schoolId;
  const staffs = ref([]);
  const isLoading = ref(false);
  const user = ref(null);
  const selectedAvatar = ref("");
  const schoolName = ref();
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
      isLoading.value = true;
      const res = await fetch(`${apiDomain}/schoolUsers/getAllUser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch school users");
      const data = await res.json();
      if (data.success) staffs.value = data.data;
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser() {
    try {
      const res = await fetch(`${apiDomain}/schoolUsers/getUser/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      user.value = data.data || null;
      console.log(user.value);
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById() {
    try {
      isLoading.value = true;
      const response = await $fetch(
        `${apiDomain}/schoolUsers/getUser/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.success) {
        const user = response.data;
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
      const res = await fetch(`${apiDomain}/schools/get/${schoolId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const json = await res.json();
      if (json.success) schoolName.value = json.data.schoolName;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave() {
    try {
      const response = await $fetch(
        `${apiDomain}/schoolUsers/updateSchoolUser/${form.value.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
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

      if (response.success) {
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
    if (!selectedAvatar.value) return
    form.value.avatar = selectedAvatar.value
    showAvatarPopup.value = false
}


  return {
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
    confirmAvatar
  };
}
