export type TopStatCardProps = {
  label: string
  value: string
  delta: string
  deltaTone: string
  icon: string
  active: string
  inactive: string
  avatarTone: string
}

const TopStatCard = ({ label, value, delta, deltaTone, icon, active, inactive, avatarTone }: TopStatCardProps) => {
  return (
    <div className="col-xxl-3 col-sm-6 d-flex">
      <div className="card flex-fill animate-card border-0">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className={`avatar avatar-xl me-2 p-1 ${avatarTone}`}>
              <img src={icon} alt={label} />
            </div>
            <div className="overflow-hidden flex-fill">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="counter mb-0">{value}</h2>
                <span className={`badge ${deltaTone}`}>{delta}</span>
              </div>
              <p className="mb-0">{label}</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between border-top mt-3 pt-3">
            <p className="mb-0">
              Active : <span className="text-dark fw-semibold">{active}</span>
            </p>
            <span className="text-light">|</span>
            <p className="mb-0">
              Inactive : <span className="text-dark fw-semibold">{inactive}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopStatCard
