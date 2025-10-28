import React, { useState, useEffect } from 'react';
// 1. Ganti import react-icons/lu dengan @iconify/react
import { Icon } from '@iconify/react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
// 2. Ganti NewProductData dengan ProductFormData dan import ProductSize
import { Category, ProductFormData, ProductSize } from '../types'; // Sesuaikan path jika perlu
import api from '../../api'; // Sesuaikan path jika perlu

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const sizeOptions: ProductSize['sizeName'][] = ['S', 'M', 'L', 'XL', 'XXL'];

// 3. Gunakan ProductFormData untuk tipe form
const TambahProdukPopup: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: '', // Default string kosong
      imageUrl: '',
      age: 'Dewasa',
      gender: 'Unisex',
      categoryId: '', // Default string kosong
      sizes: [{ sizeName: 'M', stock: '' }], // Default stock string kosong
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sizes',
  });

  // Fetch kategori (tetap sama)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
         if (response.data.length > 0) {
            // Optional: set default category jika ada
            // setValue('categoryId', response.data[0].id);
         }
      } catch (err) {
        console.error("Gagal fetch kategori:", err);
      }
    };
    fetchCategories();
  }, []); // Hapus setValue dari dependencies

  // Handle upload gambar
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSubmitError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
       setPreviewImage(reader.result as string); // Tampilkan preview
    }
    reader.readAsDataURL(file);


    const formData = new FormData();
    // Sesuaikan dengan backend 'uploadMiddleware' dan route /upload/productImage
    formData.append('productImage', file); // Nama field harus cocok

    try {
      // Panggil API upload /upload/productImage
      const response = await api.post('/upload/productImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Simpan URL gambar ke form state
      setValue('imageUrl', response.data.imageUrl); // Pastikan backend kirim 'imageUrl'
      console.log("Upload berhasil:", response.data.imageUrl);
    } catch (err: any) {
      console.error("Gagal upload gambar:", err);
      setSubmitError(err.response?.data?.message || 'Gagal upload gambar.');
      setPreviewImage(null); // Hapus preview jika gagal
      setValue('imageUrl', ''); // Kosongkan imageUrl di form jika gagal
    } finally {
      setIsUploading(false);
    }
  };

  // Handle submit form
  const onSubmit = async (data: ProductFormData) => {
    // Validasi tambahan sebelum submit
    if (!data.imageUrl) {
        setSubmitError('Foto produk wajib di-upload terlebih dahulu.');
        return;
    }
     if (data.sizes.some(s => s.stock === '' || Number(s.stock) < 0)) {
        setSubmitError('Stok untuk setiap ukuran wajib diisi dan tidak boleh negatif.');
        return;
    }


    setIsSubmitting(true);
    setSubmitError(null);

    // Konversi tipe data sebelum kirim ke API (sesuai NewProductApiData)
    const dataToSubmit = {
      name: data.name,
      description: data.description,
      price: Number(data.price), // Konversi ke number
      imageUrl: data.imageUrl,
      age: data.age,
      gender: data.gender,
      categoryId: Number(data.categoryId), // Konversi ke number
      // 4. Konversi stock ke number dan pastikan sizeName valid
      sizes: data.sizes.map(s => ({
          sizeName: s.sizeName, // Tipe sudah benar dari useFieldArray
          stock: Number(s.stock) || 0 // Konversi ke number, default 0 jika NaN
       })),
    };

    console.log("Data to submit:", dataToSubmit); // Debug data

    try {
      // Panggil API createProduct POST /products/addProduct
      await api.post('/products/addProduct', dataToSubmit);
      onSuccess(); // Panggil callback sukses
    } catch (err: any) {
      console.error("Gagal tambah produk:", err);
      setSubmitError(err.response?.data?.message || 'Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Hapus watch('imageUrl') jika tidak digunakan
  // const imageUrl = watch('imageUrl');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header Popup */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Tambahkan Produk</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            {/* 6. Ganti ikon LuX */}
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {submitError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
              {/* 6. Ganti ikon LuAlertCircle */}
              <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 mr-3" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kiri: Info Produk */}
            <div className="space-y-4">
              {/* Nama Pakaian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pakaian *</label>
                <input type="text" {...register('name', { required: 'Nama wajib diisi' })} className={`w-full input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="Contoh: Gaun Pesta Elegan" />
                {errors.name && <p className="error-message">{errors.name.message}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select {...register('categoryId', { required: 'Kategori wajib dipilih', valueAsNumber: true })} className={`w-full input-field ${errors.categoryId ? 'border-red-500' : ''}`} disabled={categories.length === 0}>
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
                {errors.categoryId && <p className="error-message">{errors.categoryId.message}</p>}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea {...register('description')} rows={4} className="w-full input-field" placeholder="Jelaskan tentang produk ini..." />
                 {/* Deskripsi tidak wajib, hapus error jika ada */}
                 {/* {errors.description && <p className="error-message">{errors.description.message}</p>} */}
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sewa (per hari) *</label>
                <input type="number" {...register('price', { required: 'Harga wajib diisi', valueAsNumber: true, min: { value: 0, message: 'Harga tidak boleh negatif' } })} className={`w-full input-field ${errors.price ? 'border-red-500' : ''}`} placeholder="Contoh: 150000" />
                {errors.price && <p className="error-message">{errors.price.message}</p>}
              </div>

              {/* Gender & Usia */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select {...register('gender')} className="w-full input-field">
                    <option value="Unisex">Unisex</option> <option value="Pria">Pria</option> <option value="Wanita">Wanita</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
                  <select {...register('age')} className="w-full input-field">
                    <option value="Dewasa">Dewasa</option> <option value="Remaja">Remaja</option> <option value="Anak">Anak</option> {/* Sesuaikan value jika perlu */}
                  </select>
                </div>
              </div>

            </div>

            {/* Kanan: Upload & Ukuran */}
            <div className="space-y-4">
              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Pakaian *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {(isUploading || previewImage) ? (
                      <div className="w-full h-40 relative flex justify-center items-center">
                        <img src={previewImage || ''} alt="Preview" className="h-40 object-contain rounded-md" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center">
                            {/* 6. Ganti ikon LuLoader2 */}
                            <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-500" />
                          </div>
                        )}
                      </div>
                    ) : (
                      // 6. Ganti ikon LuUpload
                      <Icon icon="mdi:cloud-upload-outline" className="mx-auto h-12 w-12 text-gray-400" />
                    )}

                    <div className="flex text-sm text-gray-600 justify-center"> {/* Center align */}
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload file</span>
                        <input id="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" disabled={isUploading} />
                      </label>
                      {/* <p className="pl-1">atau drag and drop</p> */}
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Maks 5MB)</p>
                  </div>
                </div>
                <input type="hidden" {...register('imageUrl', { required: 'Foto wajib di-upload' })} />
                {errors.imageUrl && <p className="error-message">{errors.imageUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran & Stok *</label>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border rounded-md p-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Controller
                        name={`sizes.${index}.sizeName`}
                        control={control}
                        rules={{ required: 'Ukuran wajib' }} 
                        render={({ field: controllerField }) => (
                          <select {...controllerField} className={`w-1/3 input-field ${errors.sizes?.[index]?.sizeName ? 'border-red-500' : ''}`}>
                            <option value="" disabled>Pilih</option>
                            {sizeOptions.map(size => (<option key={size} value={size}>{size}</option>))}
                          </select>
                        )}
                      />
                      <input
                        type="number"
                        {...register(`sizes.${index}.stock`, {
                            required: 'Stok wajib',
                            valueAsNumber: true,
                            min: { value: 0, message: 'Min 0' }
                         })}
                        className={`w-1/3 input-field text-center ${errors.sizes?.[index]?.stock ? 'border-red-500' : ''}`}
                        placeholder="Stok"
                      />
                      <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100" disabled={fields.length <= 1}>
                        <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                   {errors.sizes && typeof errors.sizes === 'object' && !Array.isArray(errors.sizes) && errors.sizes.root?.message && (
                      <p className="error-message">{errors.sizes.root.message}</p>
                   )}
                   {Array.isArray(errors.sizes) && errors.sizes.map((err, i) => (
                      <div key={i}>
                         {err?.sizeName && <p className="error-message">{err.sizeName.message}</p>}
                         {err?.stock && <p className="error-message">{err.stock.message}</p>}
                      </div>
                   ))}
                </div>
                <button type="button" onClick={() => append({ sizeName: 'M', stock: '' })} className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-1" /> Tambah Ukuran
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end items-center p-5 border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 mr-3" disabled={isSubmitting}>
            Batal
          </button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center" disabled={isUploading || isSubmitting}>
            {(isUploading || isSubmitting) && (
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin mr-2" />
            )}
            Tambahkan ke Etalase
          </button>
        </div>
      </div>
       <style jsx>{`
          .input-field { @apply px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm; }
          .error-message { @apply text-red-600 text-xs mt-1; }
       `}</style>
    </div>
  );
};

export default TambahProdukPopup;
