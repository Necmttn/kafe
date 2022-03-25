use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct DaoAddAdmin<'info> {
  #[account(
    mut, 
    constraint = dao_config.admins.contains(&signer.key())
    @ ErrorDao::UnauthorizedAccess 
  )]
  pub dao_config: Account<'info, DaoAccount>,
  pub signer: Signer<'info>,
}

pub fn handler(ctx: Context<DaoAddAdmin>, admin: Pubkey) -> Result<()> {
  if !ctx.accounts.dao_config.admins.contains(&admin) {
    ctx.accounts.dao_config.admins.push(admin);
  }
  Ok(())
}