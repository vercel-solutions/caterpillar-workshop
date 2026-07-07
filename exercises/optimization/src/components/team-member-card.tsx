export function TeamMemberCard({ member }: { member: any }) {
  return (
    <div className="bg-card border-border rounded-lg border p-6 text-center">
      <img
        alt={member.name}
        className="mx-auto h-24 w-24 rounded-full object-cover"
        src={member.avatar}
      />
      <h3 className="mt-4 font-semibold">{member.name}</h3>
      <p className="text-muted-foreground text-sm">{member.role}</p>
    </div>
  )
}
