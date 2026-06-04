import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Eye, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

type ArchiveStatus = 'active' | 'archived' | 'hidden';

type MaisonArchive = {
  id: string;
  archive_code: string;
  product_name: string;
  season: string;
  description: string;
  owner_name: string | null;
  owner_email: string | null;
  image_paths: string[];
  certificate_path: string | null;
  internal_notes: string | null;
  status: ArchiveStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type ArchiveFormState = {
  archiveCode: string;
  productName: string;
  season: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  archivePassword: string;
  internalNotes: string;
  status: ArchiveStatus;
};

const emptyArchiveForm: ArchiveFormState = {
  archiveCode: '',
  productName: '',
  season: '',
  description: '',
  ownerName: '',
  ownerEmail: '',
  archivePassword: '',
  internalNotes: '',
  status: 'active',
};

const statusLabels: Record<ArchiveStatus, string> = {
  active: 'Activo',
  archived: 'Archivado',
  hidden: 'Oculto',
};

async function hashText(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function cleanArchiveCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '-');
}

function cleanFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function storageUrl(path: string) {
  return path;
}

export default function AdminPanel() {
  const { currentUser, isAdminAccount, users, isLoadingUsers, refreshUsers, approveVip, revokeVip, deleteUser } = useAuth();
  const [archives, setArchives] = useState<MaisonArchive[]>([]);
  const [isLoadingArchives, setIsLoadingArchives] = useState(false);
  const [isArchiveFormOpen, setIsArchiveFormOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<MaisonArchive | null>(null);
  const [viewingArchive, setViewingArchive] = useState<MaisonArchive | null>(null);
  const [archiveForm, setArchiveForm] = useState<ArchiveFormState>(emptyArchiveForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [archiveMessage, setArchiveMessage] = useState('');
  const [isSavingArchive, setIsSavingArchive] = useState(false);
  const [archiveFileUrls, setArchiveFileUrls] = useState<Record<string, string>>({});

  const adminCredentials = currentUser
    ? { admin_email: currentUser.email, admin_password_hash: currentUser.passwordHash }
    : null;

  const refreshArchives = async () => {
    if (!supabase || !adminCredentials) return;

    setIsLoadingArchives(true);
    const { data, error } = await supabase.rpc('maison_archive_list', adminCredentials);
    setIsLoadingArchives(false);

    if (error || !data) {
      setArchiveMessage("Impossible de charger les archives pour le moment.");
      return;
    }

    setArchives(data as MaisonArchive[]);
  };

  useEffect(() => {
    if (isAdminAccount) {
      void refreshUsers();
      void refreshArchives();
    }
  }, [currentUser?.id, isAdminAccount]);

  useEffect(() => {
    const loadSignedUrls = async () => {
      if (!supabase || !viewingArchive) {
        setArchiveFileUrls({});
        return;
      }

      const paths = [
        ...viewingArchive.image_paths,
        ...(viewingArchive.certificate_path ? [viewingArchive.certificate_path] : []),
      ];

      if (paths.length === 0) {
        setArchiveFileUrls({});
        return;
      }

      const { data } = await supabase.storage.from('maison-archives').createSignedUrls(paths, 60 * 60);
      const nextUrls: Record<string, string> = {};
      data?.forEach((item) => {
        if (item.path && item.signedUrl) {
          nextUrls[item.path] = item.signedUrl;
        }
      });
      setArchiveFileUrls(nextUrls);
    };

    void loadSignedUrls();
  }, [viewingArchive]);

  if (!isAdminAccount) {
    return <Navigate to="/" replace />;
  }

  const members = users.filter((user) => user.role !== 'admin');
  const vipCount = members.filter((user) => user.vip).length;
  const pendingCount = members.length - vipCount;

  const openCreateArchive = () => {
    setEditingArchive(null);
    setArchiveForm(emptyArchiveForm);
    setImageFiles([]);
    setCertificateFile(null);
    setArchiveMessage('');
    setIsArchiveFormOpen(true);
  };

  const openEditArchive = (archive: MaisonArchive) => {
    setEditingArchive(archive);
    setArchiveForm({
      archiveCode: archive.archive_code,
      productName: archive.product_name,
      season: archive.season,
      description: archive.description,
      ownerName: archive.owner_name ?? '',
      ownerEmail: archive.owner_email ?? '',
      archivePassword: '',
      internalNotes: archive.internal_notes ?? '',
      status: archive.status,
    });
    setImageFiles([]);
    setCertificateFile(null);
    setArchiveMessage('');
    setIsArchiveFormOpen(true);
  };

  const uploadFiles = async (archiveCode: string) => {
    if (!supabase) return { imagePaths: [], certificatePath: null };

    const uploadedImages: string[] = [];

    for (const file of imageFiles) {
      const path = `${archiveCode}/images/${Date.now()}-${crypto.randomUUID()}-${cleanFileName(file.name)}`;
      const { error } = await supabase.storage.from('maison-archives').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) throw error;
      uploadedImages.push(path);
    }

    let uploadedCertificate: string | null = null;
    if (certificateFile) {
      const path = `${archiveCode}/certificates/${Date.now()}-${crypto.randomUUID()}-${cleanFileName(certificateFile.name)}`;
      const { error } = await supabase.storage.from('maison-archives').upload(path, certificateFile, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) throw error;
      uploadedCertificate = path;
    }

    return { imagePaths: uploadedImages, certificatePath: uploadedCertificate };
  };

  const handleArchiveSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !adminCredentials) return;

    const archiveCode = cleanArchiveCode(archiveForm.archiveCode);
    if (!archiveCode || !archiveForm.productName.trim() || !archiveForm.season.trim() || !archiveForm.description.trim()) {
      setArchiveMessage('Veuillez compléter les champs obligatoires.');
      return;
    }

    if (!editingArchive && !archiveForm.archivePassword.trim()) {
      setArchiveMessage("Veuillez définir le mot de passe de l'archive.");
      return;
    }

    setIsSavingArchive(true);
    setArchiveMessage('');

    try {
      const uploaded = await uploadFiles(archiveCode);
      const passwordHash = archiveForm.archivePassword.trim()
        ? await hashText(archiveForm.archivePassword)
        : '';
      const imagePaths = editingArchive
        ? [...editingArchive.image_paths, ...uploaded.imagePaths]
        : uploaded.imagePaths;
      const certificatePath = uploaded.certificatePath ?? editingArchive?.certificate_path ?? '';

      const payload = {
        ...adminCredentials,
        archive_code: archiveCode,
        product_name: archiveForm.productName,
        season: archiveForm.season,
        description: archiveForm.description,
        owner_name: archiveForm.ownerName,
        owner_email: archiveForm.ownerEmail,
        archive_password_hash: passwordHash,
        image_paths: imagePaths,
        certificate_path: certificatePath,
        internal_notes: archiveForm.internalNotes,
        status: archiveForm.status,
      };

      const { error } = editingArchive
        ? await supabase.rpc('maison_archive_update', { ...payload, archive_id: editingArchive.id })
        : await supabase.rpc('maison_archive_create', payload);

      if (error) {
        setArchiveMessage(error.message.includes('duplicate') ? "Ce code d'archive existe déjà." : "Impossible d'enregistrer l'archive.");
        return;
      }

      setArchiveMessage(editingArchive ? 'Archive mise à jour.' : 'Archive ajoutée.');
      setIsArchiveFormOpen(false);
      setEditingArchive(null);
      setArchiveForm(emptyArchiveForm);
      setImageFiles([]);
      setCertificateFile(null);
      await refreshArchives();
    } catch {
      setArchiveMessage("Impossible de téléverser les fichiers.");
    } finally {
      setIsSavingArchive(false);
    }
  };

  const removeArchive = async (archive: MaisonArchive) => {
    if (!supabase || !adminCredentials) return;
    const shouldDelete = window.confirm(`Eliminar l'archive ${archive.archive_code} ?`);
    if (!shouldDelete) return;

    const { error } = await supabase.rpc('maison_archive_delete', {
      ...adminCredentials,
      archive_id: archive.id,
    });

    if (error) {
      setArchiveMessage("Impossible de supprimer l'archive.");
      return;
    }

    await refreshArchives();
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#19110b] pt-28 px-6 pb-24">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-[1100px] mx-auto mb-14"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8278] mb-5">belaironeadmin</p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-[0.18em]">Comptes Supabase</h1>
            <p className="font-editorial text-xl text-[#6f675f] mt-6 max-w-2xl leading-relaxed">
              Gérez les comptes privés de la Maison, les accès VIP et les demandes First Class.
            </p>
          </div>

          <button
            onClick={() => {
              void refreshUsers();
              void refreshArchives();
            }}
            className="inline-flex items-center justify-center gap-3 border border-[#19110b] px-5 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-[#19110b] hover:text-white transition-colors"
          >
            <RefreshCw size={14} strokeWidth={1.4} className={isLoadingUsers || isLoadingArchives ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </motion.header>

      <section className="mx-auto mb-8 grid max-w-[1100px] grid-cols-3 border-y border-[#dfd7cc] bg-[#fbfaf7]">
        <div className="px-5 py-6 text-center">
          <p className="text-3xl font-light">{members.length}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Comptes</p>
        </div>
        <div className="border-x border-[#dfd7cc] px-5 py-6 text-center">
          <p className="text-3xl font-light">{vipCount}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">VIP</p>
        </div>
        <div className="px-5 py-6 text-center">
          <p className="text-3xl font-light">{pendingCount}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Public</p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto bg-white">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-[#e8e2da] text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">
          <span className="col-span-4">Membre</span>
          <span className="col-span-3 hidden md:block">Email</span>
          <span className="col-span-2">Statut</span>
          <span className="col-span-6 md:col-span-3 text-right">Décision</span>
        </div>

        {isLoadingUsers ? (
          <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Chargement des comptes Supabase.</p>
        ) : members.length === 0 ? (
          <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Aucune demande enregistrée.</p>
        ) : (
          members.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center px-6 py-5 border-b border-[#f0ece6]">
              <div className="col-span-4">
                <p className="text-sm tracking-[0.04em]">{user.name}</p>
                <p className="md:hidden text-xs text-[#8a8278] mt-1">{user.email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#aaa39a]">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <p className="col-span-3 hidden md:block text-sm text-[#6f675f]">{user.email}</p>
              <p className="col-span-2 text-sm">
                {user.vip ? 'VIP approuvé' : 'Compte public'}
              </p>
              <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-3">
                <button
                  onClick={() => void (user.vip ? revokeVip(user.id) : approveVip(user.id))}
                  className="border border-[#19110b] px-4 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#19110b] hover:text-white transition-colors"
                >
                  {user.vip ? 'Révoquer' : 'Approuver'}
                </button>
                <button
                  onClick={() => void deleteUser(user.id)}
                  className="p-2 text-[#8a8278] hover:text-[#19110b] transition-colors"
                  aria-label={`Supprimer ${user.name}`}
                >
                  <Trash2 size={16} strokeWidth={1.3} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="mx-auto mt-24 max-w-[1100px]">
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8278] mb-5">Administration privée</p>
            <h2 className="text-2xl md:text-4xl font-medium tracking-[0.16em]">LES ARCHIVES DE LA MAISON</h2>
            <p className="font-editorial text-xl text-[#6f675f] mt-5 max-w-2xl leading-relaxed">
              Archivez les pièces, certificats et informations internes de la Maison.
            </p>
          </div>
          <button
            onClick={openCreateArchive}
            className="inline-flex items-center justify-center gap-3 bg-[#19110b] px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-black transition-colors"
          >
            <Plus size={14} strokeWidth={1.5} />
            Añadir archivo
          </button>
        </div>

        {archiveMessage && (
          <p className="mb-6 border border-[#dfd7cc] bg-[#fbfaf7] px-5 py-4 font-editorial text-lg text-[#6f675f]">
            {archiveMessage}
          </p>
        )}

        {isArchiveFormOpen && (
          <form onSubmit={handleArchiveSubmit} className="mb-10 border border-[#dfd7cc] bg-white p-6 md:p-8">
            <div className="mb-8 flex items-center justify-between gap-6">
              <h3 className="text-sm uppercase tracking-[0.24em]">
                {editingArchive ? 'Editar archivo' : 'Nuevo archivo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsArchiveFormOpen(false)}
                className="text-[#8a8278] hover:text-[#19110b] transition-colors"
                aria-label="Fermer"
              >
                <X size={20} strokeWidth={1.3} />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Código de archivo</span>
                <input
                  value={archiveForm.archiveCode}
                  onChange={(event) => setArchiveForm({ ...archiveForm, archiveCode: event.target.value })}
                  required
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Nombre del producto</span>
                <input
                  value={archiveForm.productName}
                  onChange={(event) => setArchiveForm({ ...archiveForm, productName: event.target.value })}
                  required
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Colección / Saison</span>
                <input
                  value={archiveForm.season}
                  onChange={(event) => setArchiveForm({ ...archiveForm, season: event.target.value })}
                  required
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Estado</span>
                <select
                  value={archiveForm.status}
                  onChange={(event) => setArchiveForm({ ...archiveForm, status: event.target.value as ArchiveStatus })}
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                >
                  <option value="active">Activo</option>
                  <option value="archived">Archivado</option>
                  <option value="hidden">Oculto</option>
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Descripción</span>
                <textarea
                  value={archiveForm.description}
                  onChange={(event) => setArchiveForm({ ...archiveForm, description: event.target.value })}
                  required
                  rows={4}
                  className="mt-2 w-full resize-none border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Nombre del propietario</span>
                <input
                  value={archiveForm.ownerName}
                  onChange={(event) => setArchiveForm({ ...archiveForm, ownerName: event.target.value })}
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Email del propietario</span>
                <input
                  type="email"
                  value={archiveForm.ownerEmail}
                  onChange={(event) => setArchiveForm({ ...archiveForm, ownerEmail: event.target.value })}
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Contraseña del archivo</span>
                <input
                  type="password"
                  value={archiveForm.archivePassword}
                  onChange={(event) => setArchiveForm({ ...archiveForm, archivePassword: event.target.value })}
                  required={!editingArchive}
                  placeholder={editingArchive ? 'Dejar vacío para conservar' : ''}
                  className="mt-2 w-full border-b border-[#19110b]/25 bg-transparent py-3 outline-none placeholder:text-[#aaa39a] focus:border-[#19110b]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Subir certificado PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setCertificateFile(event.target.files?.[0] ?? null)}
                  className="mt-3 block w-full text-sm text-[#6f675f] file:mr-4 file:border-0 file:bg-[#19110b] file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-white"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Subir imágenes</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
                  className="mt-3 block w-full text-sm text-[#6f675f] file:mr-4 file:border-0 file:bg-[#19110b] file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.18em] file:text-white"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">Notas internas</span>
                <textarea
                  value={archiveForm.internalNotes}
                  onChange={(event) => setArchiveForm({ ...archiveForm, internalNotes: event.target.value })}
                  rows={4}
                  className="mt-2 w-full resize-none border-b border-[#19110b]/25 bg-transparent py-3 outline-none focus:border-[#19110b]"
                />
              </label>
            </div>

            <button
              disabled={isSavingArchive}
              className="mt-8 bg-[#19110b] px-8 py-4 text-[10px] uppercase tracking-[0.24em] text-white hover:bg-black disabled:cursor-wait disabled:opacity-60"
            >
              {isSavingArchive ? 'Enregistrement' : editingArchive ? 'Guardar cambios' : 'Guardar archivo'}
            </button>
          </form>
        )}

        <section className="bg-white">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-[#e8e2da] text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">
            <span className="col-span-3">Código de archivo</span>
            <span className="col-span-3">Nombre del producto</span>
            <span className="col-span-2 hidden md:block">Saison</span>
            <span className="col-span-2">Estado</span>
            <span className="col-span-2 hidden lg:block">Fecha</span>
            <span className="col-span-4 md:col-span-2 text-right">Acciones</span>
          </div>

          {isLoadingArchives ? (
            <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Chargement des archives.</p>
          ) : archives.length === 0 ? (
            <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Aucune archive enregistrée.</p>
          ) : (
            archives.map((archive) => (
              <div key={archive.id} className="grid grid-cols-12 items-center px-6 py-5 border-b border-[#f0ece6]">
                <p className="col-span-3 text-sm tracking-[0.08em]">{archive.archive_code}</p>
                <p className="col-span-3 text-sm text-[#19110b]">{archive.product_name}</p>
                <p className="col-span-2 hidden md:block text-sm text-[#6f675f]">{archive.season}</p>
                <p className="col-span-2 text-sm text-[#6f675f]">{statusLabels[archive.status]}</p>
                <p className="col-span-2 hidden lg:block text-sm text-[#6f675f]">
                  {new Date(archive.created_at).toLocaleDateString('fr-FR')}
                </p>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                  <button onClick={() => setViewingArchive(archive)} className="p-2 text-[#8a8278] hover:text-[#19110b]" aria-label="Ver">
                    <Eye size={16} strokeWidth={1.3} />
                  </button>
                  <button onClick={() => openEditArchive(archive)} className="p-2 text-[#8a8278] hover:text-[#19110b]" aria-label="Editar">
                    <Edit2 size={16} strokeWidth={1.3} />
                  </button>
                  <button onClick={() => void removeArchive(archive)} className="p-2 text-[#8a8278] hover:text-[#19110b]" aria-label="Eliminar">
                    <Trash2 size={16} strokeWidth={1.3} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </section>

      {viewingArchive && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/45 px-6 py-10">
          <div className="mx-auto max-w-[760px] bg-[#fbfaf7] p-6 text-[#19110b] md:p-10">
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a8278]">{viewingArchive.archive_code}</p>
                <h3 className="mt-4 text-2xl font-medium tracking-[0.12em]">{viewingArchive.product_name}</h3>
              </div>
              <button onClick={() => setViewingArchive(null)} className="text-[#8a8278] hover:text-[#19110b]" aria-label="Fermer">
                <X size={22} strokeWidth={1.3} />
              </button>
            </div>
            <div className="space-y-6 font-editorial text-xl leading-relaxed text-[#6f675f]">
              <p>{viewingArchive.description}</p>
              <p>Saison: {viewingArchive.season}</p>
              <p>Estado: {statusLabels[viewingArchive.status]}</p>
              {viewingArchive.owner_name && <p>Propietario: {viewingArchive.owner_name}</p>}
              {viewingArchive.owner_email && <p>Email: {viewingArchive.owner_email}</p>}
              {viewingArchive.internal_notes && <p>Notas internas: {viewingArchive.internal_notes}</p>}
            </div>
            {viewingArchive.image_paths.length > 0 && (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                {viewingArchive.image_paths.map((path) => (
                  <img key={path} src={archiveFileUrls[path] ?? storageUrl(path)} alt="" className="aspect-[4/5] w-full object-cover" />
                ))}
              </div>
            )}
            {viewingArchive.certificate_path && (
              <a
                href={archiveFileUrls[viewingArchive.certificate_path] ?? storageUrl(viewingArchive.certificate_path)}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-block border border-[#19110b] px-5 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-[#19110b] hover:text-white transition-colors"
              >
                Ver certificado PDF
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
