import React, { useState, useEffect, useRef } from 'react'; 
import { Icon } from '@iconify/react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Category, Product, ProductSize, ProductFormData } from '../types';
import api from '../../api';


type PossibleSizeName = 'S' | 'M' | 'L' | 'XL' | 'XXL';
const sizeOptions: PossibleSizeName[] = ['S', 'M', 'L', 'XL', 'XXL'];

interface Props {
  productToEdit: Product; 
  onClose: () => void;
  onSuccess: () => void;
}

// Tipe form
type EditProductFormValues = ProductFormData;


const EditProdukPopup: React.FC<Props> = ({ productToEdit, onClose, onSuccess }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(productToEdit.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<EditProductFormValues>({
    defaultValues: {
      id: productToEdit.id,
      name: productToEdit.name || '',
      description: productToEdit.description || '',
      price: productToEdit.price ? parseFloat(productToEdit.price) : '',
      imageUrl: productToEdit.imageUrl || '', 
      age: productToEdit.age || 'Dewasa',
      gender: productToEdit.gender || 'Unisex',
      categoryId: productToEdit.categoryId || '',
       sizes: (Array.isArray(productToEdit.sizes) && productToEdit.sizes.length > 0 && typeof productToEdit.sizes[0] === 'object')
             ? (productToEdit.sizes as ProductSize[]).map(s => ({ sizeName: s.sizeName, stock: s.stock ?? '' })) // Stock bisa ''
             : [{ sizeName: 'M', stock: '' }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sizes',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        setCategories(response.data);
         if (!control._defaultValues.categoryId && response.data.length > 0) {
            setValue('categoryId', response.data[0].id);
         } else if (control._defaultValues.categoryId){
             setValue('categoryId', control._defaultValues.categoryId);
         }

      } catch (err) {
        console.error("Gagal fetch kategori:", err);
      }
    };
    fetchCategories();
  }, [setValue]); 

   useEffect(() => {
     const fetchProductDetailsIfNeeded = async () => {
         const needsDetails = !Array.isArray(productToEdit.sizes) || typeof productToEdit.sizes[0] === 'string';

         if(productToEdit?.id && needsDetails) {
            console.log("Fetching detailed sizes for product:", productToEdit.id);
             setIsSubmitting(true); 
            try {
                const response = await api.get<Product>(`/products/${productToEdit.id}/details`);
                const detailedProduct = response.data;

                if (Array.isArray(detailedProduct.sizes) && typeof detailedProduct.sizes[0] !== 'string') {
                    setValue('sizes', (detailedProduct.sizes as ProductSize[]).map(s => ({ sizeName: s.sizeName, stock: s.stock ?? '' })));
                }

            } catch (error) {
                console.error("Gagal fetch detail produk untuk edit:", error);
                setSubmitError("Gagal memuat detail stok produk.");
            } finally {
                setIsSubmitting(false); 
            }
         }
     };
     fetchProductDetailsIfNeeded();
  }, [productToEdit, setValue]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };


  // Handle submit form UPDATE
  const onSubmit = async (data: EditProductFormValues) => {
    if (!productToEdit?.id) return; 

    if (data.sizes.some(s => s.stock === '' || Number(s.stock) < 0)) {
        setSubmitError('Stok untuk setiap ukuran wajib diisi dan tidak boleh negatif.');
        return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(Number(data.price) || 0));
    formData.append('categoryId', String(data.categoryId));
    formData.append('age', data.age);
    formData.append('gender', data.gender);
    formData.append('sizes', JSON.stringify(data.sizes.map(s => ({ ...s, stock: Number(s.stock) || 0 }))));

    // Append gambar HANYA jika file BARU dipilih
    if (selectedFile) {
      formData.append('productImage', selectedFile); // Sesuaikan 'productImage' dengan backend
    }

    try {
      // TEMAN ANDA HARUS BUAT ENDPOINT INI: PUT /products/:id
      await api.put(`/products/${productToEdit.id}`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(); // Panggil callback sukses (refresh tabel & tutup popup)
    } catch (err: any) {
      console.error("Gagal update produk:", err);
      setSubmitError(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Styling popup (mirip TambahProdukPopup)
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header Popup */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
             <Icon icon="mdi:pencil-box-outline" /> Edit Produk
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <Icon icon="mdi:close" className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {submitError && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
              <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 mr-3" />
              <span>{submitError}</span>
            </div>
          )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Kolom Kiri */}
              <div className="space-y-5">
                   {/* ID Produk (Read Only) */}
                   <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">ID Produk</label>
                      <input type="text" value={productToEdit.id} disabled className="input-field w-full bg-gray-100 cursor-not-allowed" />
                       {/* Hidden input for ID if needed by form data, though not strictly necessary for update */}
                       <input type="hidden" {...register('id')} />
                   </div>

                   {/* Nama Pakaian */}
                   <div>
                       <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Pakaian *</label>
                       <input id="edit-name" type="text" {...register('name', { required: 'Nama wajib diisi' })} className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`} />
                       {errors.name && <p className="error-message">{errors.name.message}</p>}
                   </div>

                   {/* Kategori */}
                   <div>
                       <label htmlFor="edit-categoryId" className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                       <select id="edit-categoryId" {...register('categoryId', { required: 'Kategori wajib dipilih', valueAsNumber: true })} className={`input-field w-full bg-white ${errors.categoryId ? 'border-red-500' : ''}`} disabled={categories.length === 0}>
                           <option value="" disabled>Pilih Kategori</option>
                           {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                       </select>
                       {errors.categoryId && <p className="error-message">{errors.categoryId.message}</p>}
                   </div>

                   {/* Deskripsi */}
                   <div>
                       <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                       <textarea id="edit-description" {...register('description')} rows={3} className="input-field w-full" />
                   </div>

                   {/* Harga */}
                   <div>
                       <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">Harga Harian (Rp) *</label>
                       <input id="edit-price" type="number" {...register('price', { required: 'Harga wajib', valueAsNumber: true, min: { value: 0, message: '> 0' } })} className={`input-field w-full ${errors.price ? 'border-red-500' : ''}`} />
                       {errors.price && <p className="error-message">{errors.price.message}</p>}
                   </div>

                   {/* Gender & Usia */}
                   <div className="flex gap-4">
                       <div className="flex-1">
                           <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                           <select id="edit-gender" {...register('gender')} className="input-field w-full bg-white">
                               <option value="Unisex">Unisex</option> <option value="Pria">Pria</option> <option value="Wanita">Wanita</option>
                           </select>
                       </div>
                       <div className="flex-1">
                           <label htmlFor="edit-age" className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
                           <select id="edit-age" {...register('age')} className="input-field w-full bg-white">
                               <option value="Dewasa">Dewasa</option> <option value="Remaja">Remaja</option> <option value="Anak">Anak</option>
                           </select>
                       </div>
                   </div>
              </div>

               {/* Kolom Kanan */}
               <div className="space-y-5">
                   {/* Upload Gambar */}
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Foto Pakaian (Klik untuk ganti)</label>
                       <div onClick={triggerFileInput} className="mt-1 flex justify-center items-center h-48 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 bg-gray-50">
                           <div className="space-y-1 text-center">
                               {isSubmitting && !previewImage ? ( // Show spinner only when submitting initial load maybe
                                   <Icon icon="mdi:loading" className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                               ) : previewImage ? (
                                   <img src={previewImage} alt="Preview Produk" className="mx-auto h-40 object-contain rounded-md" />
                               ) : (
                                   <>
                                       <Icon icon="mdi:image-outline" className="mx-auto h-12 w-12 text-gray-400" />
                                       <p className="text-sm text-gray-600">Klik untuk ganti gambar</p>
                                   </>
                               )}
                               <input ref={fileInputRef} id="edit-file-input" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                           </div>
                       </div>
                       {/* Hidden input for original imageUrl (optional) */}
                       <input type="hidden" {...register('imageUrl')} />
                   </div>

                   {/* Ukuran & Stok */}
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran & Stok *</label>
                       <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border rounded-md p-3 bg-gray-50">
                           {fields.map((field, index) => (
                               <div key={field.id} className="flex items-center gap-2">
                                   <Controller
                                       name={`sizes.${index}.sizeName`} control={control} rules={{ required: 'Pilih' }}
                                       render={({ field: f }) => (
                                           <select {...f} className={`input-field flex-1 bg-white ${errors.sizes?.[index]?.sizeName ? 'border-red-500' : ''}`}>
                                               <option value="" disabled>Ukuran</option>
                                               {sizeOptions.map(size => (<option key={size} value={size}>{size}</option>))}
                                           </select>
                                       )}
                                   />
                                   <input
                                       type="number" placeholder="Stok"
                                       {...register(`sizes.${index}.stock`, { required: 'Isi', valueAsNumber: true, min: { value: 0, message: 'Min 0' } })}
                                       className={`input-field w-24 text-center ${errors.sizes?.[index]?.stock ? 'border-red-500' : ''}`}
                                   />
                                   <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100" disabled={fields.length <= 1} title="Hapus Ukuran">
                                       <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                                   </button>
                               </div>
                           ))}
                           {/* Display array errors */}
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
               </div> {/* End Kolom Kanan */}
           </div> {/* End Grid */}
        </form>

        {/* Footer Popup */}
        <div className="flex justify-end items-center p-5 border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-100 mr-3" disabled={isSubmitting}>
            Batal
          </button>
          <button type="submit" onClick={handleSubmit(onSubmit)} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50 flex items-center" disabled={isSubmitting}>
            {isSubmitting && (<Icon icon="mdi:loading" className="w-4 h-4 animate-spin mr-2" />)}
            Simpan Perubahan
          </button>
        </div>
      </div>
       {/* Helper CSS */}
       <style jsx>{`
          .input-field { @apply px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed; }
          .error-message { @apply text-red-600 text-xs mt-1; }
       `}</style>
    </div>
  );
};

export default EditProdukPopup;

