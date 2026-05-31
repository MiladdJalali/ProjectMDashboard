export const fa = {
  app: {
    title: 'مدیریت کاربران',
    footer: 'ساخته‌شده با Vue 3 + Vite',
    loading: 'در حال بارگذاری...',
    retry: 'تلاش مجدد',
    emptySearch: 'کاربری با این جستجو پیدا نشد.',
    emptyList:
      'هنوز کاربری ثبت نشده است. برای ایجاد اولین کاربر، دکمه «افزودن کاربر» را بزنید.',
  },
  login: {
    title: 'ورود به سیستم',
    subtitle: 'برای دسترسی به مدیریت کاربران وارد شوید',
    username: 'نام کاربری',
    password: 'رمز عبور',
    usernamePlaceholder: 'نام کاربری خود را وارد کنید',
    passwordPlaceholder: 'رمز عبور',
    submit: 'ورود',
    submitting: 'در حال ورود...',
    errors: {
      usernameRequired: 'نام کاربری الزامی است.',
      passwordRequired: 'رمز عبور الزامی است.',
      invalidCredentials: 'نام کاربری یا رمز عبور اشتباه است.',
      failed: 'ورود ناموفق بود. دوباره تلاش کنید.',
    },
  },
  header: {
    title: 'مدیریت کاربران',
    subtitle: 'ایجاد، ویرایش و حذف کاربران',
    users: 'کاربر',
    logout: 'خروج',
    loggedInAs: 'کاربر فعلی:',
  },
  toolbar: {
    searchPlaceholder: 'جستجو بر اساس نام کاربری، آدرس، توضیحات...',
    searchAria: 'جستجوی کاربران',
    addUser: '+ افزودن کاربر',
  },
  table: {
    username: 'نام کاربری',
    address: 'آدرس',
    description: 'توضیحات',
    created: 'تاریخ ایجاد',
    actions: 'عملیات',
    edit: 'ویرایش',
    delete: 'حذف',
    editAria: 'ویرایش کاربر',
    deleteAria: 'حذف کاربر',
    empty: '—',
  },
  modal: {
    addTitle: 'افزودن کاربر جدید',
    editTitle: 'ویرایش کاربر',
    createBtn: 'ایجاد کاربر',
    saveBtn: 'ذخیره تغییرات',
    cancel: 'انصراف',
    close: 'بستن',
    username: 'نام کاربری',
    address: 'آدرس',
    description: 'توضیحات',
    password: 'رمز عبور',
    confirmPassword: 'تکرار رمز عبور',
    optional: '(اختیاری)',
    usernamePlaceholder: 'مثال: ali_rezaei',
    addressPlaceholder: 'تهران، خیابان...',
    descriptionPlaceholder: 'توضیحات کاربر',
    passwordPlaceholder: 'رمز عبور',
    errors: {
      usernameRequired: 'نام کاربری الزامی است.',
      passwordRequired: 'رمز عبور الزامی است.',
      confirmRequired: 'تکرار رمز عبور الزامی است.',
      passwordMismatch: 'رمز عبور و تکرار آن یکسان نیستند.',
    },
  },
  delete: {
    title: 'حذف کاربر؟',
    message: 'به‌طور دائمی حذف خواهد شد و قابل بازگشت نیست.',
    cancel: 'انصراف',
    confirm: 'حذف',
  },
  errors: {
    loadFailed: 'بارگذاری کاربران ناموفق بود.',
    createFailed: 'ایجاد کاربر ناموفق بود.',
    updateFailed: 'ویرایش کاربر ناموفق بود.',
    deleteFailed: 'حذف کاربر ناموفق بود.',
  },
}

export function emptyUserForm() {
  return {
    username: '',
    address: '',
    description: '',
    password: '',
    confirmPassword: '',
  }
}

export function formatDate(iso) {
  if (!iso) return fa.table.empty
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
