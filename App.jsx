import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, BedDouble, MapPin, Menu, Play, ShieldCheck, X } from 'lucide-react'
import { backendReady, supabase } from './supabase.js'

const WA = '2348033354167'
const assets = '/images/'
const MEDIA_BUCKET = 'ep-property-media'
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024
const MEDIA_EXTENSIONS = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/avif':'avif', 'video/mp4':'mp4', 'video/webm':'webm', 'video/quicktime':'mov' }
const sampleProperties = [
  { id:'lekki-3-bed', name:'Lekki Avanna — 3 Bedroom Bungalow', location:'Lekki, Lagos', price:'₦78M – ₦83M', beds:3, image:`${assets}02-WhatsApp-Image-2026-07-27-at-16.42.56.jpeg`, tag:'New release' },
  { id:'lekki-4-bed', name:'Lekki Avanna — 4 Bedroom Bungalow', location:'Lekki, Lagos', price:'₦85M – ₦90M', beds:4, image:`${assets}05-WhatsApp-Image-2026-07-27-at-22.10.13.jpeg`, tag:'Limited units' },
  { id:'blue-earth', name:'Blue Earth Propertyvest', location:'Lagos, Nigeria', price:'Flexible plan', beds:null, image:`${assets}08-WhatsApp-Image-2026-07-27-at-13.35.57.jpeg`, tag:'Investment plan' },
]
const waLink = name => `https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I would like to make inquiries about ${name}.`)}`
function Header(){const [open,setOpen]=useState(false);return <header className="header"><Link className="brand" to="/"><span className="brand-mark">E</span><span>EXCELLENCE<small>PROPERTIES</small></span></Link><button className="mobile-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><nav className={open?'nav open':'nav'}><a href="/#homes" onClick={()=>setOpen(false)}>Our homes</a><a href="/#partners" onClick={()=>setOpen(false)}>Our partners</a><a href="/#story" onClick={()=>setOpen(false)}>About us</a><a className="nav-cta" href={waLink('a property')} target="_blank" rel="noreferrer">Talk to an advisor <ArrowUpRight size={15}/></a></nav></header>}
function Footer(){return <footer className="footer"><Link className="brand" to="/"><span className="brand-mark">E</span><span>EXCELLENCE<small>PROPERTIES</small></span></Link><span>Find a place to belong.</span><span>© {new Date().getFullYear()} Excellence Properties</span></footer>}
function PropertyCard({property}){return <article className="property-card"><Link to={property.id==='blue-earth'?'/blue-earth':'/zylus'} className="property-image"><img src={property.image} alt={property.name}/><span className="tag">{property.tag}</span></Link><div className="property-info"><div><p className="eyebrow">{property.location}</p><h3>{property.name}</h3><p className="price">{property.price}</p></div><a className="round-arrow" href={waLink(property.name)} target="_blank" rel="noreferrer" aria-label={`Ask about ${property.name}`}><ArrowUpRight size={19}/></a></div>{property.beds&&<div className="property-meta"><span><BedDouble size={15}/>{property.beds} bedrooms</span><span><ShieldCheck size={15}/>Verified partner</span></div>}</article>}
function Home(){
  const [listings,setListings]=useState(sampleProperties)
  useEffect(()=>{
    if(!supabase)return
    supabase
      .from('ep_properties')
      .select('id,name,location,price,bedrooms,company,ep_property_media(media_url,media_type,display_order)')
      .eq('published',true)
      .order('created_at',{ascending:false})
      .then(({data})=>{
        if(!data?.length)return
        const liveListings=data.map(property=>({
          id:property.id,
          name:property.name,
          location:property.location,
          price:property.price,
          beds:property.bedrooms,
          image:property.ep_property_media?.find(media=>media.media_type==='image')?.media_url||sampleProperties[0].image,
          tag:property.company==='blue-earth'?'Blue Earth':'Zylus',
        }))
        setListings(liveListings)
      })
  },[])
  return <><Header/><main><section className="hero"><img className="hero-bg" src={`${assets}01-WhatsApp-Image-2026-07-26-at-20.10.47.jpeg`} alt="Property investment plans"/><div className="hero-shade"/><div className="hero-content"><p className="eyebrow light">A HOME THAT FEELS LIKE YOURS</p><h1>Find your place<br/>in the <em>world.</em></h1><p className="hero-copy">A considered collection of homes and property opportunities, guided by people who put your future first.</p><div className="hero-actions"><a className="button gold" href="#homes">Explore properties <ArrowRight size={17}/></a><a className="play-link" href="#story"><span><Play size={13} fill="currentColor"/></span>Get to know us</a></div></div><div className="hero-note"><span>01 / 03</span><span>Spaces to grow into</span><ArrowDown size={16}/></div></section><section className="intro" id="story"><p className="eyebrow">A BETTER WAY TO FIND HOME</p><h2>More than a property.<br/><em>A new beginning.</em></h2><p className="intro-copy">From the first viewing to the day you get your keys, we're by your side with honest advice, trusted partners and a clear path forward.</p><a className="text-link" href={waLink('property advice')} target="_blank" rel="noreferrer">Speak with our team <ArrowUpRight size={16}/></a></section><section className="homes section" id="homes"><div className="section-heading"><div><p className="eyebrow">THE COLLECTION</p><h2>Homes to <em>come home to.</em></h2></div><a className="text-link" href={waLink('available properties')} target="_blank" rel="noreferrer">View availability <ArrowUpRight size={16}/></a></div><div className="property-grid">{listings.map(p=><PropertyCard key={p.id} property={p}/>)}</div></section><section className="partner-band" id="partners"><div><p className="eyebrow light">GOOD PEOPLE. GOOD PROPERTY.</p><h2>Partners you can<br/><em>place your trust in.</em></h2><p>We work with carefully chosen property teams to bring you opportunities worth knowing about.</p></div><div className="partner-links"><Link to="/zylus"><span className="partner-dot green"/>Zylus Homes <ArrowUpRight size={18}/></Link><Link to="/blue-earth"><span className="partner-dot blue"/>Blue Earth Properties <ArrowUpRight size={18}/></Link></div></section><section className="cta"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Let's find a place<br/>for <em>what's next.</em></h2><a className="button dark" href={waLink('a property')} target="_blank" rel="noreferrer">Talk to an advisor <ArrowRight size={17}/></a></section></main><Footer/></>
}
function PartnerPage({company}){const isBlue=company==='blue-earth';const title=isBlue?'Blue Earth Properties':'Zylus Homes';const photo=isBlue?'08-WhatsApp-Image-2026-07-27-at-13.35.57.jpeg':'03-WhatsApp-Image-2026-07-27-at-22.08.21.jpeg';const info=isBlue?'A trusted pathway to property ownership, built around flexible plans and clear guidance.':'Thoughtfully planned homes in a fast growing Lagos community, with room for your family to thrive.';return <div className={isBlue?'partner-page blue-theme':'partner-page green-theme'}><Header/><main><section className="partner-hero"><div className="partner-copy"><p className="eyebrow">EXCELLENCE PROPERTIES PRESENTS</p><p className="partner-kicker">{isBlue?'BUILD YOUR FUTURE':'LIVE WELL, EVERY DAY'}</p><h1>{title.split(' ').slice(0,-1).join(' ')}<br/><em>{title.split(' ').at(-1)}</em></h1><p>{info}</p><a className="button partner-button" href={waLink(title)} target="_blank" rel="noreferrer">Make an inquiry <ArrowRight size={17}/></a><Link className="back-link" to="/">← Back to Excellence Properties</Link></div><div className="partner-visual"><img src={`${assets}${photo}`} alt={`${title} property opportunity`}/><div className="visual-caption"><MapPin size={15}/>{isBlue?'Property opportunities in Nigeria':'Lekki, Lagos'}</div></div></section><section className="partner-details"><div><p className="eyebrow">THE OPPORTUNITY</p><h2>{isBlue?'A clear plan for a confident investment.':'A home designed around real life.'}</h2></div><div><p>{isBlue?'Explore a straightforward property investment plan with structured payment options and professional support at each step.':'Discover modern bungalow homes with considered layouts, a calm community setting and flexible purchase plans.'}</p><div className="detail-image"><img src={`${assets}${isBlue?'07-WhatsApp-Image-2026-07-27-at-13.35.57-1-.jpeg':'04-WhatsApp-Image-2026-07-27-at-22.10.12.jpeg'}`} alt={`${title} details`}/></div></div></section></main><Footer/></div>}
function Admin(){
  const [session,setSession]=useState(null)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)
  const [roleLoading,setRoleLoading]=useState(false)
  const [isAdmin,setIsAdmin]=useState(false)
  const [roleError,setRoleError]=useState('')
  const [selectedFiles,setSelectedFiles]=useState([])

  useEffect(()=>{
    if(!supabase)return
    let mounted=true
    supabase.auth.getSession().then(({data,error})=>{
      if(!mounted)return
      if(error)setMessage(error.message)
      setSession(data?.session||null)
    })
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>{
      setSession(nextSession)
      setMessage('')
    })
    return()=>{mounted=false;subscription.unsubscribe()}
  },[])

  useEffect(()=>{
    let mounted=true
    if(!supabase||!session){setIsAdmin(false);setRoleError('');setRoleLoading(false);return}
    setRoleLoading(true)
    supabase.from('ep_user_roles').select('user_id').eq('user_id',session.user.id).maybeSingle().then(({data,error})=>{
      if(!mounted)return
      setIsAdmin(Boolean(data?.user_id)&&!error)
      setRoleError(error?.message||'')
      setRoleLoading(false)
    })
    return()=>{mounted=false}
  },[session])

  const signIn=async event=>{
    event.preventDefault()
    if(!supabase)return
    setBusy(true);setMessage('')
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password})
    if(error)setMessage(error.message)
    setBusy(false)
  }

  const grantSql=()=>{
    const accountEmail=(session?.user?.email||'').replace(/'/g,"''")
    if(!accountEmail)return ''
    return `insert into public.ep_user_roles (user_id, role) select id, 'admin' from auth.users where lower(email) = lower('${accountEmail}') on conflict (user_id) do update set role = excluded.role;`
  }
  const copyGrantSql=async()=>{
    try{await navigator.clipboard.writeText(grantSql());setMessage('Admin setup SQL copied. Paste it into the Supabase SQL Editor and run it.')}
    catch{setMessage('Could not copy automatically. Select and copy the SQL below.')}
  }

  const upload=async event=>{
    event.preventDefault()
    if(!supabase||!isAdmin)return
    const form=event.currentTarget
    const formData=new FormData(form)
    const files=Array.from(form.elements.media.files||[])
    const invalid=files.find(file=>!MEDIA_EXTENSIONS[file.type]||file.size>MAX_UPLOAD_BYTES)
    if(invalid){
      setMessage(!MEDIA_EXTENSIONS[invalid.type]?`${invalid.name} is not a supported image or video format.`:`${invalid.name} is larger than the 50 MB per-file limit.`)
      return
    }

    setBusy(true);setMessage('Preparing listing…')
    const id=crypto.randomUUID()
    const uploadedPaths=[]
    let propertyCreated=false
    try{
      const {data:property,error:propertyError}=await supabase.from('ep_properties').insert({
        id,
        name:String(formData.get('name')||'').trim(),
        company:formData.get('company'),
        location:String(formData.get('location')||'').trim(),
        price:String(formData.get('price')||'').trim(),
        description:String(formData.get('description')||'').trim(),
        bedrooms:Number(formData.get('bedrooms'))||null,
        published:formData.get('published')==='on',
      }).select('id').single()
      if(propertyError)throw new Error(propertyError.message)
      propertyCreated=true

      const mediaRows=[]
      for(let index=0;index<files.length;index++){
        const file=files[index]
        const extension=MEDIA_EXTENSIONS[file.type]
        const path=`properties/${property.id}/${crypto.randomUUID()}.${extension}`
        setMessage(`Uploading ${index+1} of ${files.length}: ${file.name}`)
        const {error:uploadError}=await supabase.storage.from(MEDIA_BUCKET).upload(path,file,{
          contentType:file.type,
          cacheControl:'3600',
          upsert:false,
        })
        if(uploadError)throw new Error(`${file.name}: ${uploadError.message}`)
        uploadedPaths.push(path)
        const {data:{publicUrl}}=supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
        mediaRows.push({
          property_id:property.id,
          media_type:file.type.startsWith('video/')?'video':'image',
          media_url:publicUrl,
          storage_path:path,
          display_order:index,
        })
      }

      if(mediaRows.length){
        setMessage('Saving media details…')
        const {error:mediaError}=await supabase.from('ep_property_media').insert(mediaRows)
        if(mediaError)throw new Error(mediaError.message)
      }
      setMessage(files.length?'Listing and media uploaded successfully.':'Listing created successfully.')
      form.reset();setSelectedFiles([])
    }catch(error){
      if(uploadedPaths.length)await supabase.storage.from(MEDIA_BUCKET).remove(uploadedPaths)
      if(propertyCreated){
        await supabase.from('ep_property_media').delete().eq('property_id',id)
        await supabase.from('ep_properties').delete().eq('id',id)
      }
      setMessage(`The listing was not completed. ${error?.message||'Please try again.'}`)
    }finally{setBusy(false)}
  }

  return <><Header/><main className="admin-shell"><div className="admin-card">
    <p className="eyebrow">EXCELLENCE PROPERTIES</p><h1>Listing studio</h1><p className="admin-sub">Add a property and its photos or videos.</p>
    {!backendReady?<div className="notice">Supabase is not configured in this build. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then restart Vite or redeploy.</div>
    :!session?<><form className="admin-form" onSubmit={signIn}>
      <label>Email<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="username" required/></label>
      <label>Password<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required/></label>
      <button className="button dark" disabled={busy}>{busy?'Signing in…':'Sign in securely'}</button>
    </form><div className="notice admin-help">If you do not have an admin login yet, create the user in <a href="https://supabase.com/dashboard/project/odmlbknyhattwsswsnll/auth/users" target="_blank" rel="noreferrer">Supabase → Authentication → Users</a>. Then sign in here and follow the admin-role setup shown on this page.</div></>
    :roleLoading?<div className="notice">Checking your admin access…</div>
    :!isAdmin?<><div className="notice"><strong>Admin access is not assigned to this account.</strong><br/>Open Supabase SQL Editor and run the statement below. It assigns the admin role using your signed-in email, so you do not need to find or copy a UUID. Then sign out and sign back in.</div>
      {roleError&&<p className="form-message">Could not check the role: {roleError}</p>}
      <pre className="admin-sql" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:'14px',background:'#f0eee7',fontSize:'11px',lineHeight:1.7}}>{grantSql()||'This sign-in does not have an email address. Sign in with the admin email account.'}</pre>
      {grantSql()&&<button type="button" className="button dark" onClick={copyGrantSql}>Copy admin setup SQL</button>}
      <button className="signout" onClick={()=>supabase.auth.signOut()}>Sign out</button>
    </>
    :<><form className="admin-form" onSubmit={upload}>
      <div className="form-row"><label>Listing name<input name="name" required placeholder="e.g. 3 bedroom bungalow"/></label><label>Partner<select name="company"><option value="zylus">Zylus Homes</option><option value="blue-earth">Blue Earth Properties</option><option value="excellence">Excellence Properties</option></select></label></div>
      <div className="form-row"><label>Location<input name="location" required placeholder="Lekki, Lagos"/></label><label>Price<input name="price" required placeholder="₦78M – ₦83M"/></label></div>
      <div className="form-row"><label>Bedrooms<input name="bedrooms" type="number" min="0" step="1" placeholder="3"/></label><label>Property photos and videos<input name="media" type="file" accept={Object.keys(MEDIA_EXTENSIONS).join(',')} multiple onChange={event=>setSelectedFiles(Array.from(event.target.files||[]))}/></label></div>
      {selectedFiles.length>0&&<div className="notice"><strong>{selectedFiles.length} file{selectedFiles.length===1?'':'s'} selected</strong><br/>{selectedFiles.map(file=>`${file.name} · ${(file.size/1024/1024).toFixed(1)} MB`).join(' · ')}<br/>Maximum 50 MB per file.</div>}
      <label>Description<textarea name="description" rows="4" placeholder="Describe the property and its key features"/></label>
      <label className="check"><input name="published" type="checkbox"/> Publish this listing now</label>
      <button className="button dark" disabled={busy}>{busy?'Saving…':'Create listing'}</button>
    </form><button className="signout" onClick={()=>supabase.auth.signOut()}>Sign out</button></>}
    {message&&<p className="form-message" role="status">{message}</p>}
    <p className="admin-hint">Private admin sign-in · <Link to="/">Return to website</Link></p>
  </div></main><Footer/></>
}
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/zylus" element={<PartnerPage company="zylus"/>}/><Route path="/blue-earth" element={<PartnerPage company="blue-earth"/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<Home/>}/></Routes>}
